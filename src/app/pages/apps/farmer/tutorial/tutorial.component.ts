import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';

interface TutorialStep {
  icon: string;
  title: string;
  text: string;
}

@Component({
  selector: 'app-farmer-tutorial',
  standalone: true,
  imports: [CommonModule, RouterLink, MaterialModule, TablerIconsModule],
  templateUrl: './tutorial.component.html',
  styleUrl: './tutorial.component.scss'
})
export class FarmerTutorialComponent {
  readonly steps: TutorialStep[] = [
    {
      icon: 'search',
      title: 'Busca un asesor',
      text: 'Usa el catálogo para encontrar especialistas por nombre, profesión, experiencia o fecha disponible.'
    },
    {
      icon: 'user-check',
      title: 'Revisa su perfil',
      text: 'Mira su experiencia, ubicación, calificación y horarios antes de reservar.'
    },
    {
      icon: 'calendar-event',
      title: 'Elige un horario',
      text: 'Selecciona una fecha libre. Cuando confirmas, ese horario deja de estar disponible para otros productores.'
    },
    {
      icon: 'message-2',
      title: 'Describe tu consulta',
      text: 'Explica el problema de tu cultivo o producción para que el asesor llegue preparado.'
    },
    {
      icon: 'video',
      title: 'Únete a la consulta',
      text: 'Cuando llegue la fecha, entra desde tus citas y abre el enlace de la videoconferencia.'
    },
    {
      icon: 'star',
      title: 'Califica la atención',
      text: 'Después de la cita, deja una reseña para ayudar a otros productores a elegir mejor.'
    }
  ];
}
