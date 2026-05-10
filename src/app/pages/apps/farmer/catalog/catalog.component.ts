import { Component, OnInit, signal } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Advisor } from "./advisor";
import { AdvisorService } from "src/app/services/apps/catalog/advisor.service";
import { RouterLink } from "@angular/router";
import { AvailableDateService } from "../../../../services/apps/catalog/available-date.service";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {AiService} from "../../../../services/apps/catalog/ai.service";
import {finalize} from "rxjs";

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
  message: string = "";
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

    this.messages.push(
      new ChatMessage('user', this.message, null)
    );

    const userMsg = this.message;
    this.message = '';
    this.loading = true;

    switch (userMsg.toLowerCase().trim()) {
      case 'hola':
        this.messages.push(
          new ChatMessage(
            'ai',
            '¡Hola! Por favor describe cómo quieres tu asesoría (tema, duración, estilo, preferencias). Con esa información te mostraré el asesor más adecuado a tus necesidades.',
            null
          )
        );
        this.loading = false;
        return;

      case 'gracias':
      case 'muchas gracias':
        this.messages.push(
          new ChatMessage(
            'ai',
            '¡De nada! Estoy aquí para ayudarte cuando lo necesites.',
            null
          )
        );
        this.loading = false;
        return;
      case 'adios':
      case 'adiós':
        this.messages.push(
          new ChatMessage(
            'ai',
            '¡Hasta luego! Si necesitas más ayuda, no dudes en volver.',
            null
          )
        );
        this.loading = false;
        return;

      case 'que':
      case 'qué':
        this.messages.push(
          new ChatMessage(
            'ai',
            'SO',
            null
          )
        );
        this.loading = false;
        return;

      default:
        this.aiService.sendMessage(userMsg)
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: (answer) => {
              const text = answer.response ?? 'No se obtuvo respuesta del servicio.';
              const advisorId = answer.advisorId ?? null;

              this.messages.push(
                new ChatMessage('ai', text, advisorId)
              );
            },
            error: (err) => {
              console.error('Error from AI service:', err);
              this.messages.push(
                new ChatMessage(
                  'ai',
                  'Lo siento, hubo un error al procesar tu solicitud.',
                  null
                )
              );
            }
          });
        return;
    }
  }

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  private loadAdvisors(): void {
    this.advisorService.getAdvisors().subscribe({
      next: (data) => {
        this.originalAdvisors = data;
        this.advisors.set(data);
      },
      error: (err) => console.error('Error loading advisors:', err),
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchText.set(filterValue);
    this.filterAdvisors();
  }

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.selectedDate = event.value;
    this.filterAdvisors();
  }

  private filterAdvisors(): void {
    const text = this.searchText().toLowerCase();

    let filtered = this.originalAdvisors.filter(a => {
      const fullName = `${a.firstName} ${a.lastName}`.toLowerCase();
      return fullName.includes(text);
    });

    if (this.selectedDate) {
      const dateStr = this.selectedDate!.toISOString().split('T')[0];
      this.availableDatesService.getAvailableDatesByDate(dateStr).subscribe({
        next: (slots) => {
          const availableAdvisorIds = new Set(slots.map(s => s.advisorId));
          this.advisors.set(filtered.filter(a => availableAdvisorIds.has(a.advisorId)));
        },
        error: err => console.error(err)
      });
    }
    else {
      this.advisors.set(filtered);
    }
  }
}

class ChatMessage {
  from: string;
  text: string;
  advisorId: number | null;

  constructor(from: string, text: string, advisorId: number | null = null) {
    this.from = from;
    this.text = text;
    this.advisorId = advisorId;
  }
}
