import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
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
  message: string;
}

@Component({
  selector: 'app-advisor-appointments',
  standalone: true,
  templateUrl: './advisor-appointments.component.html',
  imports: [CommonModule, FormsModule, MaterialModule, TablerIconsModule, RouterLink, TimeFormatPipe]
})
export class AdvisorAppointmentsComponent implements OnInit {
  private allAppointments: EnrichedAppointment[] = [];

  appointments = signal<EnrichedAppointment[]>([]);
  protected readonly parseAppointmentDate = parseAppointmentDate;
  loading = signal(true);
  errorMessage = signal('');
  searchText = '';
  selectedDate: Date | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments() {
    this.loading.set(true);
    this.errorMessage.set('');
    this.appointmentService.getMyAdvisorAppointments().subscribe({
      next: (allAppointments: AppointmentDetailed[]) => {
        this.allAppointments = allAppointments
          .filter((appointment) => appointment.status !== 'COMPLETED' && !this.isPast(appointment))
          .map((appointment) => this.toEnrichedAppointment(appointment));

        this.applyFilters();
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudieron cargar tus citas.');
        this.loading.set(false);
      }
    });
  }

  applyTextFilter(event: Event): void {
    this.searchText = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters();
  }

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.selectedDate = event.value;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedDate = null;
    this.applyFilters();
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

  private applyFilters(): void {
    const text = this.searchText.trim().toLowerCase();
    const selectedDate = this.selectedDate ? this.toLocalDateString(this.selectedDate) : '';

    this.appointments.set(this.allAppointments.filter((appointment) => {
      const textMatch = !text || [
        appointment.farmerName,
        appointment.message,
        appointment.status,
        appointment.date
      ].join(' ').toLowerCase().includes(text);
      const dateMatch = !selectedDate || appointment.date === selectedDate;
      return textMatch && dateMatch;
    }));
  }

  private toEnrichedAppointment(appointment: AppointmentDetailed): EnrichedAppointment {
    return {
      id: appointment.id,
      farmerId: appointment.farmerId,
      farmerName: appointment.farmerName || `Productor #${appointment.farmerId}`,
      farmerPhoto: appointment.farmerPhoto || 'assets/images/profile/user-1.jpg',
      date: appointment.availableDate.scheduledDate,
      startTime: appointment.availableDate.startTime,
      endTime: appointment.availableDate.endTime,
      status: appointment.status,
      message: appointment.message || ''
    };
  }

  private toLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
