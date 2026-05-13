import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from '../../../../material.module';
import { TimeFormatPipe } from 'src/app/pipes/filter.pipe';
import { AppointmentDetailed, parseAppointmentDate } from '../../farmer/appointment/appointment-detailed';
import { AppointmentService } from 'src/app/services/apps/appointment/appointment.service';

interface EnrichedAppointment {
  id: number;
  farmerId: number;
  farmerName: string;
  farmerPhoto: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'ONGOING' | 'COMPLETED';
}

@Component({
  selector: 'app-advisor-appointments',
  standalone: true,
  templateUrl: './advisor-appointments.component.html',
  imports: [CommonModule, MaterialModule, TablerIconsModule, RouterLink, TimeFormatPipe]
})
export class AdvisorAppointmentsComponent implements OnInit {
  appointments = signal<EnrichedAppointment[]>([]);
  protected readonly parseAppointmentDate = parseAppointmentDate;
  loading = signal(true);

  constructor(
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments() {
    this.loading.set(true);
    this.appointmentService.getMyAdvisorAppointments().subscribe({
      next: (allAppointments: AppointmentDetailed[]) => {
        const enriched = allAppointments
          .filter((appointment) => appointment.status !== 'COMPLETED' && !this.isPast(appointment))
          .map((appointment) => ({
            id: appointment.id,
            farmerId: appointment.farmerId,
            farmerName: appointment.farmerName || `Productor #${appointment.farmerId}`,
            farmerPhoto: appointment.farmerPhoto || 'assets/images/profile/user-1.jpg',
            date: appointment.availableDate.scheduledDate,
            startTime: appointment.availableDate.startTime,
            endTime: appointment.availableDate.endTime,
            status: appointment.status
          }));

        this.appointments.set(enriched);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  isPast(appointment: AppointmentDetailed): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = parseAppointmentDate(appointment.availableDate.scheduledDate);
    if (!appointmentDate) return false;
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate < today;
  }

  goToDetail(appointmentId: number) {
    this.router.navigate(['/apps/advisor/appointments', appointmentId]);
  }

  goToHistory() {
    this.router.navigate(['/apps/advisor/appointments/history']);
  }
}
