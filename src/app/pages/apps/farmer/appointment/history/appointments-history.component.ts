import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from 'src/app/services/apps/appointment/appointment.service';
import { AppointmentDetailed } from '../appointment-detailed';
import { RouterLink } from "@angular/router";
import { AvailableDateService } from 'src/app/services/apps/catalog/available-date.service';
import { AdvisorService } from 'src/app/services/apps/catalog/advisor.service';
import { TablerIconsModule } from "angular-tabler-icons";
import { MaterialModule } from "../../../../../material.module";
import { TimeFormatPipe } from "../../../../../pipes/filter.pipe";
import { MatDialog } from '@angular/material/dialog';
import { ReviewDialogComponent } from 'src/app/shared/components/review-dialog/review-dialog.component';

@Component({
  selector: 'app-appointments-history',
  standalone: true,
  templateUrl: './appointments-history.component.html',
  imports: [
    CommonModule,
    RouterLink,
    MaterialModule,
    TablerIconsModule,
    TimeFormatPipe,
  ]
})
export class AppAppointmentsHistoryComponent implements OnInit {
  history: AppointmentDetailed[] = [];
  loading = true;

  constructor(
    private appointmentService: AppointmentService,
    private availableDateService: AvailableDateService,
    private advisorService: AdvisorService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchHistory();
  }

  fetchHistory() {
    this.loading = true;
    this.appointmentService.getMyAppointments().subscribe({
      next: (data) => {
        if (!data.length) {
          this.history = [];
          this.loading = false;
          return;
        }

        // Enriquecer datos con información del asesor
        let loaded = 0;
        const enriched: AppointmentDetailed[] = [];

        data.forEach((appt, idx) => {
          this.availableDateService.getAvailableDateById(appt.availableDateId).subscribe({
            next: (date) => {
              this.advisorService.getAdvisor(date.advisorId).subscribe({
                next: (advisor) => {
                  enriched[idx] = {
                    ...appt,
                    advisorId: date.advisorId,
                    advisorName: advisor.firstName + ' ' + advisor.lastName,
                    advisorPhoto: advisor.photo,
                    scheduledDate: date.scheduledDate,
                    startTime: date.startTime,
                    endTime: date.endTime
                  };
                  loaded++;
                  if (loaded === data.length) {
                    // Filtrar solo citas PASADAS (completadas o con fecha < hoy)
                    this.history = enriched.filter(a =>
                      a && (a.status === 'COMPLETED' || this.isPast(a))
                    );
                    this.loading = false;
                  }
                },
                error: () => {
                  loaded++;
                  if (loaded === data.length) {
                    this.history = enriched.filter(a =>
                      a && (a.status === 'COMPLETED' || this.isPast(a))
                    );
                    this.loading = false;
                  }
                }
              });
            },
            error: () => {
              loaded++;
              if (loaded === data.length) {
                this.history = enriched.filter(a =>
                  a && (a.status === 'COMPLETED' || this.isPast(a))
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
    today.setHours(0, 0, 0, 0);
    const apptDate = new Date(appt.scheduledDate);
    apptDate.setHours(0, 0, 0, 0);
    return apptDate < today;
  }

  openReviewDialog(appointment: AppointmentDetailed): void {
    // Obtener advisor info del appointment enriquecido
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        appointmentId: appointment.id,
        advisorId: appointment.advisorId || 0, // Nota: deberíamos tener esto del enriquecimiento
        advisorName: appointment.advisorName || 'Asesor',
        advisorPhoto: appointment.advisorPhoto
      }
    });

    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        // Reseña creada/actualizada exitosamente
        console.log('Reseña guardada exitosamente');
      }
    });
  }
}
