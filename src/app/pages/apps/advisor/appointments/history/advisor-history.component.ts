import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { TimeFormatPipe } from 'src/app/pipes/time-format.pipe';
import { AdvisorReviewDialogComponent } from 'src/app/shared/components/advisor-review-dialog/advisor-review-dialog.component';
import { AppointmentDetailed } from 'src/app/pages/apps/farmer/appointment/appointment-detailed';
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
  selector: 'app-advisor-history',
  standalone: true,
  templateUrl: './advisor-history.component.html',
  imports: [CommonModule, MaterialModule, TablerIconsModule, TimeFormatPipe]
})
export class AdvisorHistoryComponent implements OnInit {
  appointments = signal<EnrichedAppointment[]>([]);
  loading = signal(true);

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchHistory();
  }

  fetchHistory() {
    this.loading.set(true);
    this.appointmentService.getMyAdvisorAppointments().subscribe({
      next: (allAppointments: AppointmentDetailed[]) => {
        const enriched = allAppointments
          .filter((appointment) => appointment.status === 'COMPLETED' || this.isPast(appointment))
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
    const appointmentDate = new Date(appointment.availableDate.scheduledDate);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate < today;
  }

  goBack() {
    this.router.navigate(['/apps/advisor/appointments']);
  }

  viewReview(appointmentId: number) {
    this.dialog.open(AdvisorReviewDialogComponent, {
      width: '500px',
      autoFocus: false,
      data: { appointmentId }
    });
  }
}
