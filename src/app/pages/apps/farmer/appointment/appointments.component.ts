import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { TimeFormatPipe } from 'src/app/pipes/filter.pipe';
import { AppointmentService } from 'src/app/services/apps/appointment/appointment.service';
import { AdvisorService } from 'src/app/services/apps/catalog/advisor.service';
import type { AppointmentDetailed } from 'src/app/pages/apps/farmer/appointment/appointment-detailed';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  imports: [CommonModule, TimeFormatPipe, RouterLink, MaterialModule, TablerIconsModule]
})
export class AppAppointmentsComponent implements OnInit {
  appointments: AppointmentDetailed[] = [];
  loading = true;

  constructor(
    private appointmentService: AppointmentService,
    private advisorService: AdvisorService,
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
    this.appointmentService.getMyAppointments().subscribe({
      next: (data) => {
        this.advisorService.getAdvisorCatalog().subscribe({
          next: (advisors) => {
            this.appointments = data
              .map((appointment) => {
                const advisor = advisors.find((item) => item.advisorId === appointment.availableDate.advisorId);
                return {
                  ...appointment,
                  advisorId: appointment.availableDate.advisorId,
                  advisorName: advisor ? `${advisor.firstName} ${advisor.lastName}` : 'Asesor',
                  advisorPhoto: advisor?.photo ?? 'assets/images/profile/user-1.jpg',
                  scheduledDate: appointment.availableDate.scheduledDate,
                  startTime: appointment.availableDate.startTime,
                  endTime: appointment.availableDate.endTime,
                };
              })
              .filter((appointment) => appointment.status !== 'COMPLETED' && !this.isPast(appointment));
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
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
    const appointmentDate = new Date(appointment.availableDate.scheduledDate);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate < today;
  }
}
