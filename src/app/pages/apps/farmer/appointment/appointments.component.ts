import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from 'src/app/services/apps/appointment/appointment.service';
import { FarmerService } from 'src/app/services/apps/catalog/farmer.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TimeFormatPipe } from 'src/app/pipes/filter.pipe';
import { AvailableDateService } from 'src/app/services/apps/catalog/available-date.service';
import { AdvisorService } from 'src/app/services/apps/catalog/advisor.service';
import {Router, RouterLink} from '@angular/router';
import type { AppointmentDetailed } from 'src/app/pages/apps/farmer/appointment/appointment-detailed';
import {TablerIconsModule} from "angular-tabler-icons";
import {MaterialModule} from "src/app/material.module";

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  imports: [
    CommonModule,
    TimeFormatPipe,
    RouterLink,
    MaterialModule,
    TablerIconsModule
  ]
})
export class AppAppointmentsComponent implements OnInit {
  appointments: AppointmentDetailed[] = [];
  loading = true;

  constructor(
    private appointmentService: AppointmentService,
    private farmerService: FarmerService,
    private authService: AuthService,
    private availableDateService: AvailableDateService,
    private advisorService: AdvisorService,
    private router: Router
  ) {}

  goToDetail(id: number) {
    this.router.navigate(['/apps/farmer/appointments/', id]);
  }

  ngOnInit(): void {
    // Si no hay farmerId en localStorage, lo obtenemos usando el userId del usuario logueado
    const farmerId = localStorage.getItem('farmerId');
    if (!farmerId) {
      const user = this.authService.user;
      if (user && user.id) {
        this.farmerService.getFarmerByUserId(user.id).subscribe({
          next: (farmer) => {
            localStorage.setItem('farmerId', String(farmer.farmerId));
            this.fetchAppointments();
          },
          error: () => {
            this.loading = false;
          }
        });
      } else {
        this.loading = false;
      }
    } else {
      this.fetchAppointments();
    }
  }

  fetchAppointments() {
    this.loading = true;
    this.appointmentService.getMyAppointments().subscribe({
      next: (data) => {
        if (!data.length) {
          this.appointments = [];
          this.loading = false;
          return;
        }
        let loaded = 0;
        const enriched: AppointmentDetailed[] = [];
        data.forEach((appt, idx) => {
          this.availableDateService.getAvailableDateById(appt.availableDateId).subscribe({
            next: (date) => {
              this.advisorService.getAdvisor(date.advisorId).subscribe({
                next: (advisor) => {
                  enriched[idx] = {
                    ...appt,
                    advisorName: advisor.firstName + ' ' + advisor.lastName,
                    advisorPhoto: advisor.photo,
                    scheduledDate: date.scheduledDate,
                    startTime: date.startTime,
                    endTime: date.endTime
                  };
                  loaded++;
                  if (loaded === data.length) {
                    // Filtrar solo citas FUTURAS (no completadas y fecha >= hoy)
                    this.appointments = enriched.filter(a =>
                      a &&
                      a.status !== 'COMPLETED' &&
                      !this.isPast(a)
                    );
                    this.loading = false;
                  }
                },
                error: () => {
                  loaded++;
                  if (loaded === data.length) {
                    this.appointments = enriched.filter(a =>
                      a &&
                      a.status !== 'COMPLETED' &&
                      !this.isPast(a)
                    );
                    this.loading = false;
                  }
                }
              });
            },
            error: () => {
              loaded++;
              if (loaded === data.length) {
                this.appointments = enriched.filter(a =>
                  a &&
                  a.status !== 'COMPLETED' &&
                  !this.isPast(a)
                );
                this.loading = false;
              }
            }
          });
        });
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  isPast(appt: AppointmentDetailed): boolean {
    if (!appt.scheduledDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Comparar solo fecha, no hora
    const apptDate = new Date(appt.scheduledDate);
    apptDate.setHours(0, 0, 0, 0);
    return apptDate < today;
  }
}
