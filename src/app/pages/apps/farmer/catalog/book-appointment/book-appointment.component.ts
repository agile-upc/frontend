import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { AppointmentService } from 'src/app/services/apps/appointment/appointment.service';
import { AvailableDateService } from 'src/app/services/apps/catalog/available-date.service';
import { AdvisorService } from 'src/app/services/apps/catalog/advisor.service';
import { Advisor } from '../advisor';
import { AvailableDate } from './available-date';
import { AppointmentDetailed } from '../../appointment/appointment-detailed';
import { DateI18nService } from 'src/app/services/date-i18n.service';

interface ExistingAppointmentRange {
  scheduledDate: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-advisor-page',
  imports: [MaterialModule, TablerIconsModule, NgIf, RouterLink, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './book-appointment.component.html'
})
export class AppBookAppointmentComponent implements OnInit {
  protected advisor!: Advisor;
  protected dates: AvailableDate[] = [];
  protected conflictMessage = '';
  private existingAppointmentRanges: ExistingAppointmentRange[] = [];

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public advisorService: AdvisorService,
    public availableDateService: AvailableDateService,
    public appointmentService: AppointmentService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private dateI18n: DateI18nService
  ) {}

  ngOnInit(): void {
    this.loadMyAppointments();

    this.activatedRoute.params.subscribe((params) => {
      const advisorId = Number(params['advisorId']);
      if (advisorId) {
        this.loadAdvisor(advisorId);
        this.loadAvailableDates(advisorId);
      }
    });

    this.activatedRoute.queryParamMap.subscribe((params) => {
      const message = params.get('message');
      if (message) {
        this.form.get('comment')!.setValue(message);
      }
    });
  }

  form = new FormGroup({
    date: new FormControl<number | null>(null, Validators.required),
    comment: new FormControl('', Validators.required),
  });

  private loadAdvisor(advisorId: number): void {
    this.advisorService.getAdvisor(advisorId).subscribe({
      next: (advisor) => {
        this.advisor = advisor;
      },
      error: (err) => console.error('Error loading advisor:', err)
    });
  }

  private loadAvailableDates(advisorId: number): void {
    this.availableDateService.getAvailableDatesByAdvisor(advisorId).subscribe({
      next: (data) => {
        this.dates = data;
        this.selectFirstAvailableNonConflictingDate();
      },
      error: (err) => console.error('Error loading available dates:', err)
    });
  }

  private loadMyAppointments(): void {
    this.appointmentService.getMyAppointments().subscribe({
      next: (appointments: AppointmentDetailed[]) => {
        this.existingAppointmentRanges = appointments
          .filter((appointment) => appointment.status !== 'COMPLETED')
          .map((appointment) => ({
            scheduledDate: appointment.scheduledDate ?? appointment.availableDate?.scheduledDate ?? '',
            startTime: appointment.startTime ?? appointment.availableDate?.startTime ?? '',
            endTime: appointment.endTime ?? appointment.availableDate?.endTime ?? '',
          }))
          .filter((appointment) => appointment.scheduledDate && appointment.startTime && appointment.endTime);
        this.selectFirstAvailableNonConflictingDate();
        this.updateConflictMessage();
      },
      error: (err) => console.error('Error loading current appointments:', err)
    });
  }

  protected calculateAge(birthDate: Date): number {
    return moment().diff(birthDate, 'years');
  }

  protected formatAvailableDate(scheduledDate: string, startTime: string, endTime: string): string {
    const date = moment(scheduledDate, 'YYYY-MM-DD').toDate();
    return `${this.dateI18n.format(date, 'longDate')}, ${startTime} - ${endTime}`;
  }

  protected onDateChange(): void {
    this.updateConflictMessage();
  }

  protected isDateConflicting(date: AvailableDate): boolean {
    return this.existingAppointmentRanges.some((appointment) => {
      if (appointment.scheduledDate !== date.scheduledDate) {
        return false;
      }

      const requestedStart = this.parseTimeToMinutes(date.startTime);
      const requestedEnd = this.parseTimeToMinutes(date.endTime);
      const existingStart = this.parseTimeToMinutes(appointment.startTime);
      const existingEnd = this.parseTimeToMinutes(appointment.endTime);

      if (
        requestedStart === null ||
        requestedEnd === null ||
        existingStart === null ||
        existingEnd === null
      ) {
        return false;
      }

      return requestedStart < existingEnd && requestedEnd > existingStart;
    });
  }

  private selectFirstAvailableNonConflictingDate(): void {
    if (this.dates.length === 0) {
      this.form.get('date')!.setValue(null);
      return;
    }

    const currentDate = this.selectedAvailableDate();
    if (currentDate && !this.isDateConflicting(currentDate)) {
      return;
    }

    const firstNonConflictingDate = this.dates.find((date) => !this.isDateConflicting(date));
    this.form.get('date')!.setValue(firstNonConflictingDate?.dateId ?? null);
  }

  private selectedAvailableDate(): AvailableDate | undefined {
    const selectedId = this.form.get('date')!.value;
    return this.dates.find((date) => date.dateId === selectedId);
  }

  private updateConflictMessage(): void {
    const selectedDate = this.selectedAvailableDate();
    if (selectedDate && this.isDateConflicting(selectedDate)) {
      this.conflictMessage = this.translate.instant('booking.conflict.range');
      return;
      this.conflictMessage = this.translate.instant('booking.conflict.day');
      return;
    }

    this.conflictMessage = '';
  }

  protected submit() {
    this.updateConflictMessage();

    if (!this.form.valid) {
      return;
    }

    if (this.conflictMessage) {
      this.toastr.warning(this.conflictMessage, this.translate.instant('booking.warning.unavailableSchedule'));
      return;
    }

    this.appointmentService.bookAppointment({
      availableDateId: this.form.get('date')!.value ?? 0,
      message: this.form.get('comment')!.value ?? '',
    }).subscribe({
      next: () => {
        this.availableDateService.clearCache();
        this.toastr.success(this.translate.instant('booking.success.created'), this.translate.instant('common.success'));
        this.router.navigate(['apps/farmer/catalog']);
      },
      error: (err) => {
        if (err?.status === 409) {
          this.toastr.warning(this.translate.instant('booking.conflict.range'), this.translate.instant('booking.warning.unavailableSchedule'));
          return;
          this.toastr.warning(this.translate.instant('booking.conflict.day'), this.translate.instant('booking.warning.unavailableSchedule'));
          return;
        }

        this.toastr.error(this.translate.instant('booking.error.create'), this.translate.instant('common.error'));
      }
    });
  }

  private parseTimeToMinutes(time: string): number | null {
    const [hours, minutes] = time.split(':').map((value) => Number(value));
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return null;
    }

    return hours * 60 + minutes;
  }
}
