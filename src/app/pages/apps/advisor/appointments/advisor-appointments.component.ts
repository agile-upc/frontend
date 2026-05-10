import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from '../../../../material.module';
import { TimeFormatPipe } from 'src/app/pipes/filter.pipe';
import { AppointmentDetailed } from '../../farmer/appointment/appointment-detailed';
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
  selector: 'app-advisor-appointments',
  standalone: true,
  templateUrl: './advisor-appointments.component.html',
  imports: [CommonModule, MaterialModule, TablerIconsModule, RouterLink, TimeFormatPipe]
})
export class AdvisorAppointmentsComponent implements OnInit {
  appointments = signal<EnrichedAppointment[]>([]);
  loading = signal(true);

  constructor(
    private appointmentService: AppointmentService,
    private profileService: ProfileService,
    private farmerService: FarmerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments() {
    this.loading.set(true);
    this.appointmentService.getMyAdvisorAppointments().subscribe({
      next: async (allAppointments: AppointmentDetailed[]) => {
        const enriched = await Promise.all(allAppointments.map(async (appointment) => {
          if (appointment.status === 'COMPLETED' || this.isPast(appointment)) {
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

  goToDetail(appointmentId: number) {
    this.router.navigate(['/apps/advisor/appointments', appointmentId]);
  }

  goToHistory() {
    this.router.navigate(['/apps/advisor/appointments/history']);
  }
}
