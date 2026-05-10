import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { TimeFormatPipe } from 'src/app/pipes/time-format.pipe';
import { AdvisorReviewDialogComponent } from 'src/app/shared/components/advisor-review-dialog/advisor-review-dialog.component';
import { AppointmentDetailed } from 'src/app/pages/apps/farmer/appointment/appointment-detailed';
import { AppointmentService } from 'src/app/services/apps/appointment/appointment.service';
import { FarmerService } from 'src/app/services/apps/catalog/farmer.service';
import { ProfileService } from 'src/app/shared/services/profile.service';

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
    private profileService: ProfileService,
    private farmerService: FarmerService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchHistory();
  }

  fetchHistory() {
    this.loading.set(true);
    this.appointmentService.getMyAdvisorAppointments().subscribe({
      next: async (allAppointments: AppointmentDetailed[]) => {
        const enriched = await Promise.all(allAppointments.map(async (appointment) => {
          if (appointment.status !== 'COMPLETED' && !this.isPast(appointment)) {
            return null;
          }

          try {
            const farmer = await firstValueFrom(this.farmerService.getFarmer(appointment.farmerId));
            const profile = await firstValueFrom(this.profileService.findProfileByUserId(farmer.userId));
            return {
              id: appointment.id,
              farmerId: appointment.farmerId,
              farmerName: profile ? `${profile.firstName} ${profile.lastName}` : `Productor #${appointment.farmerId}`,
              farmerPhoto: profile?.photo || 'assets/images/profile/user-1.jpg',
              date: appointment.availableDate.scheduledDate,
              startTime: appointment.availableDate.startTime,
              endTime: appointment.availableDate.endTime,
              status: appointment.status
            };
          } catch {
            return null;
          }
        }));

        this.appointments.set(enriched.filter(Boolean) as EnrichedAppointment[]);
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
