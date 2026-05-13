import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
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
  imports: [CommonModule, RouterLink, MaterialModule, TablerIconsModule, TimeFormatPipe]
})
export class AppAppointmentsHistoryComponent implements OnInit {
  history: AppointmentDetailed[] = [];
  protected readonly parseAppointmentDate = parseAppointmentDate;
  loading = true;

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchHistory();
  }

  fetchHistory() {
    this.loading = true;
    this.appointmentService.getMyAppointments().subscribe({
      next: (data) => {
        this.history = data
          .filter((appointment) => appointment.status === 'COMPLETED' || this.isPast(appointment));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
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

    dialogRef.afterClosed().subscribe();
  }
}
