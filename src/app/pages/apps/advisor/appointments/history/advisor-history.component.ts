import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AppointmentService } from 'src/app/services/apps/appointment/appointment.service';
import { AvailableDateService } from 'src/app/services/apps/catalog/available-date.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { FarmerService } from 'src/app/services/apps/catalog/farmer.service';
import { AppointmentDetailed } from 'src/app/pages/apps/farmer/appointment/appointment-detailed';
import { TimeFormatPipe } from 'src/app/pipes/time-format.pipe';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AdvisorService } from 'src/app/services/apps/catalog/advisor.service';
import { TablerIconsModule } from "angular-tabler-icons";
import { MaterialModule } from "src/app/material.module";
import { MatDialog } from '@angular/material/dialog';
import { AdvisorReviewDialogComponent } from 'src/app/shared/components/advisor-review-dialog/advisor-review-dialog.component';

interface EnrichedAppointment {
  id: number;
  farmerId: number;
  farmerName: string;
  farmerPhoto: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
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
    private availableDateService: AvailableDateService,
    private profileService: ProfileService,
    private farmerService: FarmerService,
    private authService: AuthService,
    private advisorService: AdvisorService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Si no hay advisorId en localStorage, lo obtenemos usando el userId del usuario logueado
    const advisorId = localStorage.getItem('advisorId');

    // Validar que advisorId existe y no es "undefined" o "null"
    if (!advisorId || advisorId === 'undefined' || advisorId === 'null' || advisorId === '0') {
      const user = this.authService.user;
      if (user && user.id) {
        this.advisorService.getAdvisorByUserId(user.id).subscribe({
          next: (advisor) => {
            localStorage.setItem('advisorId', String(advisor.id));
            this.fetchHistory();
          },
          error: () => {
            this.loading.set(false);
          }
        });
      } else {
        this.loading.set(false);
      }
    } else {
      this.fetchHistory();
    }
  }

  fetchHistory() {
    this.loading.set(true);

    // Obtener citas del asesor autenticado
    this.appointmentService.getMyAdvisorAppointments().subscribe({
      next: (allAppointments: AppointmentDetailed[]) => {
        // Filtrar solo citas completadas o pasadas
        const enrichmentPromises = allAppointments.map((appt: AppointmentDetailed) => {
          return new Promise<EnrichedAppointment | null>((resolve) => {
            // Filtrar solo completadas o pasadas
            if (appt.status !== 'COMPLETED' && !this.isPast(appt)) {
              resolve(null);
              return;
            }

            // Obtener availableDate para conseguir info de la cita
            this.availableDateService.getAvailableDateById(appt.availableDateId).subscribe({
              next: (date) => {
                // Primero obtener el Farmer por farmerId para conseguir el userId
                this.farmerService.getFarmer(appt.farmerId).subscribe({
                  next: (farmer) => {
                    // Ahora obtener el Profile usando el userId del farmer
                    this.profileService.fetchProfile(farmer.userId).subscribe({
                      next: (profile) => {
                        resolve({
                          id: appt.id,
                          farmerId: appt.farmerId,
                          farmerName: `${profile.firstName} ${profile.lastName}`,
                          farmerPhoto: profile.photo || 'assets/images/profile/user-1.jpg',
                          date: date.scheduledDate,
                          startTime: date.startTime,
                          endTime: date.endTime,
                          status: appt.status
                        });
                      },
                      error: () => resolve(null)
                    });
                  },
                  error: () => resolve(null)
                });
              },
              error: () => resolve(null)
            });
          });
        });

        Promise.all(enrichmentPromises).then(enriched => {
          const validAppointments = enriched.filter(a => a !== null) as EnrichedAppointment[];
          this.appointments.set(validAppointments);
          this.loading.set(false);
        });
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  isPast(appointment: any): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const apptDate = new Date(appointment.scheduledDate);
    apptDate.setHours(0, 0, 0, 0);
    return apptDate < today;
  }

  goBack() {
    this.router.navigate(['/apps/advisor/appointments']);
  }

  viewReview(appointmentId: number) {
    const dialogRef = this.dialog.open(AdvisorReviewDialogComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        appointmentId: appointmentId
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      // Dialog cerrado
    });
  }
}
