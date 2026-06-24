import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { AppDeleteDialogComponent } from 'src/app/shared/components/delete-dialog/delete-dialog.component';
import { AppointmentService } from 'src/app/services/apps/appointment/appointment.service';
import { AppointmentDetailed, parseAppointmentDate } from 'src/app/pages/apps/farmer/appointment/appointment-detailed';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DateI18nService } from 'src/app/services/date-i18n.service';

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, TablerIconsModule, TranslateModule],
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.scss']
})
export class AppointmentDetailComponent implements OnInit {
  appointment?: AppointmentDetailed;
  loading = true;
  error = false;
  errorMessage = '';
  formattedDate = '';
  formattedTime = '';
  cancelLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private dateI18n: DateI18nService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = true;
      this.loading = false;
      return;
    }

    this.appointmentService.getAppointmentById(id).subscribe({
      next: (appointment) => {
        this.appointment = appointment;
        this.formattedDate = this.formatDate(appointment.availableDate.scheduledDate);
        this.formattedTime = this.formatTime(appointment.availableDate.startTime, appointment.availableDate.endTime);
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  formatDate(dateVal: string | Date | undefined): string {
    if (!dateVal) return '';
    const date = parseAppointmentDate(dateVal);
    if (!date) return '';
    return this.dateI18n.format(date, 'longDate');
  }

  formatTime(start?: string, end?: string): string {
    return start && end ? `${start} - ${end}` : '';
  }

  goBack() {
    this.router.navigate(['/apps/farmer/appointments']);
  }

  openCancelModal() {
    if (!this.appointment) return;

    const dialogRef = this.dialog.open(AppDeleteDialogComponent, {
      width: '400px',
      autoFocus: false,
      data: {
        id: this.appointment.id,
        name: this.translate.instant('appointments.with', { name: this.appointment.advisorName }),
        type: this.translate.instant('appointments.singular')
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.cancelAppointment();
      }
    });
  }

  private cancelAppointment() {
    if (!this.appointment) return;

    this.cancelLoading = true;
    this.appointmentService.cancelAppointment(this.appointment.id).subscribe({
      next: () => {
        this.cancelLoading = false;
        this.router.navigate(['/apps/farmer/appointments']);
      },
      error: () => {
        this.cancelLoading = false;
        this.errorMessage = this.translate.instant('appointments.error.cancel');
      }
    });
  }
}
