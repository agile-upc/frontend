import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Subject, finalize, takeUntil } from 'rxjs';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { AdvisorService } from 'src/app/services/apps/catalog/advisor.service';
import { AvailableDateService } from '../../../../services/apps/catalog/available-date.service';
import { AiService } from '../../../../services/apps/catalog/ai.service';
import { Advisor } from './advisor';
import { AiAnswer, AiRecommendationMatch } from './ai-answer';

@Component({
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    CommonModule,
    RouterLink,
  ],
})
export class AppCatalogComponent implements OnInit, OnDestroy {
  private readonly chatSessionKey = 'farmer-catalog-ai-chat';
  private readonly destroy$ = new Subject<void>();
  private originalAdvisors: Advisor[] = [];
  private aiConversationId: string | null = null;

  advisors = signal<Advisor[]>([]);
  searchText = signal<string>('');
  selectedDate: Date | null = null;
  chatOpen = false;
  loading = false;
  catalogLoading = true;
  catalogError = '';
  message = '';
  messages = this.createDefaultMessages();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private advisorService: AdvisorService,
    private availableDatesService: AvailableDateService,
    private aiService: AiService
  ) {}

  ngOnInit(): void {
    this.restoreChatSession();
    this.watchOpenChatRouteParam();
    this.loadAdvisors();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sendMessage() {
    if (!this.message.trim()) return;

    this.messages.push(new ChatMessage('user', this.message));
    this.persistChatSession();
    const userMsg = this.message;
    this.message = '';
    this.loading = true;

    this.aiService.sendMessage(userMsg, this.aiConversationId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (answer) => {
          this.syncConversation(answer);
          this.messages.push(this.buildAiMessage(answer));
          this.persistChatSession();
        },
        error: (error: HttpErrorResponse) => {
          this.aiConversationId = null;
          this.messages.push(
            new ChatMessage('ai', this.getAiErrorMessage(error))
          );
          this.persistChatSession();
        }
      });
  }

  toggleChat() {
    this.chatOpen = !this.chatOpen;
    this.persistChatSession();
  }

  goToAiRecommendation(message: ChatMessage): void {
    if (!message.advisorId) {
      return;
    }

    const queryParams = message.draftAppointmentMessage
      ? { message: message.draftAppointmentMessage }
      : undefined;

    this.router.navigate(['/apps/farmer/catalog', message.advisorId], { queryParams });
  }

  goToAiBooking(message: ChatMessage): void {
    if (!message.advisorId) {
      return;
    }

    const queryParams = message.draftAppointmentMessage
      ? { message: message.draftAppointmentMessage }
      : undefined;

    if (message.selectedMatch?.nextAvailableDate) {
      this.router.navigate(
        ['/apps/farmer/catalog', message.advisorId, 'book'],
        { queryParams }
      );
      return;
    }

    this.router.navigate(
      ['/apps/farmer/catalog', message.advisorId],
      { queryParams }
    );
  }

  applyFilter(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value.toLowerCase());
    this.filterAdvisors();
  }

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.selectedDate = event.value;
    this.filterAdvisors();
  }

  clearFilters(): void {
    this.searchText.set('');
    this.selectedDate = null;
    this.advisors.set(this.originalAdvisors);
  }

  private loadAdvisors(): void {
    this.catalogLoading = true;
    this.catalogError = '';
    this.advisorService.getAdvisorCatalog()
      .pipe(finalize(() => this.catalogLoading = false))
      .subscribe({
        next: (data) => {
          this.originalAdvisors = data;
          this.advisors.set(data);
        },
        error: () => {
          this.catalogError = 'No se pudo cargar el catálogo de asesores.';
          this.advisors.set([]);
        },
      });
  }

  private filterAdvisors(): void {
    this.catalogError = '';
    const text = this.searchText().toLowerCase();
    const filtered = this.originalAdvisors.filter((advisor) =>
      `${advisor.firstName} ${advisor.lastName} ${advisor.occupation} ${advisor.description}`
        .toLowerCase()
        .includes(text)
    );

    if (!this.selectedDate) {
      this.advisors.set(filtered);
      return;
    }

    const dateStr = this.toLocalDateString(this.selectedDate);
    this.catalogLoading = true;
    this.availableDatesService.getAvailableDatesByDate(dateStr)
      .pipe(finalize(() => this.catalogLoading = false))
      .subscribe({
        next: (slots) => {
          const availableAdvisorIds = new Set(slots.map((slot) => slot.advisorId));
          this.advisors.set(filtered.filter((advisor) => availableAdvisorIds.has(advisor.advisorId)));
        },
        error: () => {
          this.catalogError = 'No se pudo filtrar por fecha. Intenta nuevamente.';
          this.advisors.set(filtered);
        }
      });
  }

  private buildAiMessage(answer: AiAnswer): ChatMessage {
    const fallbackNotice = answer.usedFallback
      ? 'Respuesta generada con lógica de respaldo.'
      : null;
    const selectedMatch = answer.selectedAdvisorId != null
      ? answer.matches.find((match) => match.advisorId === answer.selectedAdvisorId) ?? null
      : null;

    if (answer.status === 'NEEDS_MORE_INFO') {
      const retryMessage = !answer.conversationId
        ? 'No pude iniciar la sesión de aclaración. Intenta reformular tu solicitud.'
        : null;

      return new ChatMessage(
        'ai',
        [answer.summary, answer.clarifyingQuestion, retryMessage]
          .filter((value): value is string => Boolean(value))
          .join('\n\n') || 'Necesito un poco más de detalle para recomendarte un asesor.',
        null,
        null,
        null,
        fallbackNotice
      );
    }

    if (answer.status === 'UNAVAILABLE') {
      return new ChatMessage(
        'ai',
        answer.summary || 'No encontré una recomendación disponible en este momento.',
        null,
        null,
        null,
        fallbackNotice
      );
    }

    return new ChatMessage(
      'ai',
      answer.summary || 'Encontré asesores que podrían ayudarte.',
      answer.selectedAdvisorId,
      selectedMatch,
      answer.draftAppointmentMessage,
      fallbackNotice
    );
  }

  private getAiErrorMessage(error: HttpErrorResponse): string {
    return error.error?.message || 'Lo siento, hubo un error al procesar tu solicitud.';
  }

  private syncConversation(answer: AiAnswer): void {
    if (answer.status === 'NEEDS_MORE_INFO') {
      this.aiConversationId = answer.conversationId ?? null;
      return;
    }

    this.aiConversationId = null;
  }

  private restoreChatSession(): void {
    const cached = sessionStorage.getItem(this.chatSessionKey);
    if (!cached) {
      return;
    }

    try {
      const parsed = JSON.parse(cached) as {
        aiConversationId: string | null;
        chatOpen: boolean;
        messages: Array<{
          from: string;
          text: string;
          advisorId: number | null;
          selectedMatch: AiRecommendationMatch | null;
          draftAppointmentMessage: string | null;
          fallbackNotice: string | null;
        }>;
      };

      this.aiConversationId = parsed.aiConversationId ?? null;
      this.chatOpen = Boolean(parsed.chatOpen);
      this.messages = Array.isArray(parsed.messages) && parsed.messages.length > 0
        ? parsed.messages.map((message) => new ChatMessage(
            message.from,
            message.text,
            message.advisorId ?? null,
            message.selectedMatch ?? null,
            message.draftAppointmentMessage ?? null,
            message.fallbackNotice ?? null
          ))
        : this.createDefaultMessages();
    } catch {
      sessionStorage.removeItem(this.chatSessionKey);
      this.messages = this.createDefaultMessages();
    }
  }

  private watchOpenChatRouteParam(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params.get('openChat') !== 'true') {
          return;
        }

        this.chatOpen = true;
        this.persistChatSession();
      });
  }

  private persistChatSession(): void {
    sessionStorage.setItem(this.chatSessionKey, JSON.stringify({
      aiConversationId: this.aiConversationId,
      chatOpen: this.chatOpen,
      messages: this.messages
    }));
  }

  private createDefaultMessages(): ChatMessage[] {
    return [
      new ChatMessage(
        'ai',
        'Hola. Te ayudaré a encontrar el asesor ideal. Cuéntame qué necesitas.'
      )
    ];
  }

  private toLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

class ChatMessage {
  constructor(
    public from: string,
    public text: string,
    public advisorId: number | null = null,
    public selectedMatch: AiRecommendationMatch | null = null,
    public draftAppointmentMessage: string | null = null,
    public fallbackNotice: string | null = null
  ) {}
}
