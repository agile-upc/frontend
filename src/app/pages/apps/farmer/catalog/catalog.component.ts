import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { finalize } from 'rxjs';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { AdvisorService } from 'src/app/services/apps/catalog/advisor.service';
import { AvailableDateService } from '../../../../services/apps/catalog/available-date.service';
import { AiService } from '../../../../services/apps/catalog/ai.service';
import { Advisor } from './advisor';

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
export class AppCatalogComponent implements OnInit {
  private originalAdvisors: Advisor[] = [];
  advisors = signal<Advisor[]>([]);
  searchText = signal<string>('');
  selectedDate: Date | null = null;
  chatOpen = false;
  loading = false;
  message = '';
  messages = [
    new ChatMessage(
      'ai',
      '¡Hola! Te ayudaré a encontrar el asesor ideal. Cuéntame qué necesitas.',
      null
    )
  ];

  constructor(
    private advisorService: AdvisorService,
    private availableDatesService: AvailableDateService,
    private aiService: AiService
  ) {}

  ngOnInit(): void {
    this.loadAdvisors();
  }

  sendMessage() {
    if (!this.message.trim()) return;

    this.messages.push(new ChatMessage('user', this.message, null));
    const userMsg = this.message;
    this.message = '';
    this.loading = true;

    this.aiService.sendMessage(userMsg)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (answer) => {
          this.messages.push(
            new ChatMessage(
              'ai',
              answer.response ?? 'No se obtuvo respuesta del servicio.',
              answer.advisorId ?? null
            )
          );
        },
        error: () => {
          this.messages.push(
            new ChatMessage('ai', 'Lo siento, hubo un error al procesar tu solicitud.', null)
          );
        }
      });
  }

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  private loadAdvisors(): void {
    this.advisorService.getAdvisorCatalog().subscribe({
      next: (data) => {
        this.originalAdvisors = data;
        this.advisors.set(data);
      },
      error: (err) => console.error('Error loading advisors:', err),
    });
  }

  applyFilter(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value.toLowerCase());
    this.filterAdvisors();
  }

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.selectedDate = event.value;
    this.filterAdvisors();
  }

  private filterAdvisors(): void {
    const text = this.searchText().toLowerCase();
    const filtered = this.originalAdvisors.filter((advisor) =>
      `${advisor.firstName} ${advisor.lastName}`.toLowerCase().includes(text)
    );

    if (!this.selectedDate) {
      this.advisors.set(filtered);
      return;
    }

    const dateStr = this.selectedDate.toISOString().split('T')[0];
    this.availableDatesService.getAvailableDatesByDate(dateStr).subscribe({
      next: (slots) => {
        const availableAdvisorIds = new Set(slots.map((slot) => slot.advisorId));
        this.advisors.set(filtered.filter((advisor) => availableAdvisorIds.has(advisor.advisorId)));
      },
      error: (err) => console.error(err)
    });
  }
}

class ChatMessage {
  constructor(
    public from: string,
    public text: string,
    public advisorId: number | null = null
  ) {}
}
