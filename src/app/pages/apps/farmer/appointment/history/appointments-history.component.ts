import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from '../../../../../material.module';
import { TimeFormatPipe } from '../../../../../pipes/filter.pipe';
import { ReviewDialogComponent } from 'src/app/shared/components/review-dialog/review-dialog.component';
import { AppointmentDetailed, parseAppointmentDate } from '../appointment-detailed';
import { AppointmentService } from 'src/app/services/apps/appointment/appointment.service';

@Component({
  selector: 'app-appointments-history',
  standalone: true,
  templateUrl: './appointments-history.component.html',
  imports: [CommonModule, FormsModule, RouterLink, MaterialModule, TablerIconsModule, TimeFormatPipe]
})
export class AppAppointmentsHistoryComponent implements OnInit {
  private allHistory: AppointmentDetailed[] = [];

  history: AppointmentDetailed[] = [];
  protected readonly parseAppointmentDate = parseAppointmentDate;
  loading = true;
  errorMessage = '';
  searchText = '';
  selectedDate: Date | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchHistory();
  }

  fetchHistory() {
    this.loading = true;
    this.errorMessage = '';
    this.appointmentService.getMyAppointments().subscribe({
      next: (data) => {
        this.allHistory = data
          .filter((appointment) => appointment.status === 'COMPLETED' || this.isPast(appointment));
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el historial de citas.';
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

  openReviewDialog(appointment: AppointmentDetailed): void {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        appointmentId: appointment.id,
        advisorId: appointment.availableDate.advisorId,
        advisorName: appointment.advisorName || 'Asesor',
        advisorPhoto: appointment.advisorPhoto
      }
    });

    dialogRef.afterClosed().subscribe((saved) => {
      if (saved) {
        this.fetchHistory();
      }
    });
  }

  private applyFilters(): void {
    const text = this.searchText.trim().toLowerCase();
    const selectedDate = this.selectedDate ? this.toLocalDateString(this.selectedDate) : '';

    this.history = this.allHistory.filter((appointment) => {
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
