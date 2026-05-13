import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { AppDeleteDialogComponent } from 'src/app/shared/components/delete-dialog/delete-dialog.component';
import { AppointmentDetailed, parseAppointmentDate } from '../../../farmer/appointment/appointment-detailed';
import { AppointmentService } from 'src/app/services/apps/appointment/appointment.service';

@Component({
  selector: 'app-advisor-appointment-detail',
  standalone: true,
  templateUrl: './advisor-appointment-detail.component.html',
  styleUrls: ['./advisor-appointment-detail.component.scss'],
  imports: [CommonModule, FormsModule, MaterialModule, TablerIconsModule]
})
export class AdvisorAppointmentDetailComponent implements OnInit {
  appointmentId!: number;
  appointment = signal<AppointmentDetailed | null>(null);
  farmerName = signal('');
  farmerPhoto = signal('');
  scheduledDate = signal('');
  startTime = signal('');
  endTime = signal('');
  formattedDate = signal('');
  meetingUrl = signal('');
  message = signal('');
  loading = signal(true);
  cancelLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/apps/advisor/appointments']);
      return;
    }

    this.appointmentId = id;
    this.loadAppointmentData();
  }

  loadAppointmentData() {
    this.loading.set(true);
    this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
      next: (appointment) => {
        this.appointment.set(appointment);
        this.message.set(appointment.message);
        this.meetingUrl.set(appointment.meetingUrl || '');
        this.scheduledDate.set(appointment.availableDate.scheduledDate);
        this.formattedDate.set(this.formatDate(appointment.availableDate.scheduledDate));
        this.startTime.set(appointment.availableDate.startTime);
        this.endTime.set(appointment.availableDate.endTime);
        this.farmerName.set(appointment.farmerName || `Productor #${appointment.farmerId}`);
        this.farmerPhoto.set(appointment.farmerPhoto || 'assets/images/profile/user-1.jpg');
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/apps/advisor/appointments']);
      }
    });
  }

  formatDate(dateVal: string | Date | undefined): string {
    if (!dateVal) return '';
    const date = parseAppointmentDate(dateVal);
    if (!date) return '';
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  openCancelModal() {
    const appointment = this.appointment();
    if (!appointment) return;

    const dialogRef = this.dialog.open(AppDeleteDialogComponent, {
      width: '400px',
      autoFocus: false,
      data: {
        id: appointment.id,
        name: `cita con ${this.farmerName()}`,
        type: 'cita'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.cancelAppointment();
      }
    });
  }

  private cancelAppointment() {
    this.cancelLoading.set(true);
    this.errorMessage.set('');

    this.appointmentService.cancelAppointment(this.appointmentId).subscribe({
      next: () => {
        this.cancelLoading.set(false);
        this.router.navigate(['/apps/advisor/appointments']);
      },
      error: (err) => {
        this.cancelLoading.set(false);
        this.errorMessage.set('Error al cancelar la cita. Por favor intenta nuevamente.');
        console.error('Error al cancelar cita:', err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/apps/advisor/appointments']);
  }
}
