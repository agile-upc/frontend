import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { TimeFormatPipe } from 'src/app/pipes/filter.pipe';
import { AppointmentService } from 'src/app/services/apps/appointment/appointment.service';
import { AppointmentDetailed, parseAppointmentDate } from 'src/app/pages/apps/farmer/appointment/appointment-detailed';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  imports: [CommonModule, FormsModule, TimeFormatPipe, RouterLink, MaterialModule, TablerIconsModule]
})
export class AppAppointmentsComponent implements OnInit {
  private allAppointments: AppointmentDetailed[] = [];

  appointments: AppointmentDetailed[] = [];
  protected readonly parseAppointmentDate = parseAppointmentDate;
  loading = true;
  errorMessage = '';
  searchText = '';
  selectedDate: Date | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  goToDetail(id: number) {
    this.router.navigate(['/apps/farmer/appointments/', id]);
  }

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments() {
    this.loading = true;
    this.errorMessage = '';
    this.appointmentService.getMyAppointments().subscribe({
      next: (data) => {
        this.allAppointments = data
          .filter((appointment) => appointment.status !== 'COMPLETED' && !this.isPast(appointment));
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar tus citas.';
        this.loading = false;
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
    if (!appointment.availableDate?.scheduledDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = parseAppointmentDate(appointment.availableDate.scheduledDate);
    if (!appointmentDate) return false;
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate < today;
  }

  private applyFilters(): void {
    const text = this.searchText.trim().toLowerCase();
    const selectedDate = this.selectedDate ? this.toLocalDateString(this.selectedDate) : '';

    this.appointments = this.allAppointments.filter((appointment) => {
      const appointmentDate = this.toAppointmentDateString(appointment);
      const textMatch = !text || [
        appointment.advisorName,
        appointment.message,
        appointment.status,
        appointmentDate
      ].join(' ').toLowerCase().includes(text);
      const dateMatch = !selectedDate || appointmentDate === selectedDate;
      return textMatch && dateMatch;
    });
  }

  private toAppointmentDateString(appointment: AppointmentDetailed): string {
    const appointmentDate = parseAppointmentDate(appointment.scheduledDate ?? appointment.availableDate?.scheduledDate);
    return appointmentDate ? this.toLocalDateString(appointmentDate) : '';
  }

  private toLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
