import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {
  CalendarEvent,
  CalendarModule,
  CalendarView,
  CalendarDateFormatter,
} from 'angular-calendar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { TimeFormatPipe } from 'src/app/pipes/filter.pipe';
import { AppointmentService } from 'src/app/services/apps/appointment/appointment.service';
import { AvailableDateService } from 'src/app/services/apps/appointment/available-date.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import {
  AppointmentDetailed,
  parseAppointmentDate,
} from '../../farmer/appointment/appointment-detailed';
import { AvailableDate } from 'src/app/shared/model/available-date';
import { AvailableDateCreateDialogComponent } from 'src/app/components/available-dates/create-dialog/available-date-create-dialog.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalizedDatePipe } from 'src/app/pipes/localized-date.pipe';
import { DateI18nService } from 'src/app/services/date-i18n.service';
import { CalendarI18nDateFormatter } from './calendar-i18n-date-formatter';

interface CalendarMeta {
  type: 'appointment' | 'availability';
  appointmentId?: number;
}

interface CalendarListItem {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'appointment' | 'availability';
  status: string;
  appointmentId?: number;
}

@Component({
  selector: 'app-advisory-calendar',
  standalone: true,
  imports: [CommonModule, CalendarModule, MaterialModule, TablerIconsModule, TimeFormatPipe, LocalizedDatePipe, TranslateModule],
  templateUrl: './advisory-calendar.component.html',
  styleUrl: './advisory-calendar.component.scss',
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CalendarI18nDateFormatter,
    },
  ],
})
export class AdvisoryCalendarComponent implements OnInit {
  readonly CalendarView = CalendarView;

  view: CalendarView = CalendarView.Month;
  viewDate = new Date();
  events: CalendarEvent<CalendarMeta>[] = [];
  upcomingItems: CalendarListItem[] = [];
  loading = true;
  errorMessage = '';

  private readonly appointmentColor = {
    primary: '#4f7c5c',
    secondary: '#e7f1e8',
  };
  private readonly availabilityColor = {
    primary: '#9a6a2f',
    secondary: '#f3eadc',
  };

  constructor(
    private appointmentService: AppointmentService,
    private availableDateService: AvailableDateService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService,
    private dateI18n: DateI18nService,
  ) {}

  get isAdvisor(): boolean {
    return this.authService.user.role === 'ADVISOR';
  }

  get calendarLocale(): string {
    return this.angularCalendarLocale;
  }

  get periodLabel(): string {
    if (this.view === CalendarView.Day) {
      return this.dateI18n.format(this.viewDate, 'longDate');
    }

    if (this.view === CalendarView.Week) {
      return `${this.translate.instant('calendar.weekOf')} ${this.dateI18n.format(this.viewDate, 'weekdayMonth')}`;
    }

    return this.dateI18n.format(this.viewDate, 'monthYear');
  }

  private get angularCalendarLocale(): string {
    const lang = this.translate.currentLang || this.translate.defaultLang || 'es';
    return lang === 'es' ? 'es-PE' : 'es';
  }

  ngOnInit(): void {
    this.loadCalendar();
  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  previousPeriod(): void {
    this.viewDate = this.shiftDate(-1);
  }

  nextPeriod(): void {
    this.viewDate = this.shiftDate(1);
  }

  today(): void {
    this.viewDate = new Date();
  }

  handleEventClick(event: CalendarEvent<CalendarMeta>): void {
    if (event.meta?.type !== 'appointment' || !event.meta.appointmentId) {
      return;
    }

    const routePrefix = this.isAdvisor ? '/apps/advisor/appointments' : '/apps/farmer/appointments';
    this.router.navigate([routePrefix, event.meta.appointmentId]);
  }

  goToAvailability(): void {
    this.router.navigate(['/apps/advisor/available-dates']);
  }

  handleCalendarDateClick(date: Date, useExactTime = false): void {
    if (!this.isAdvisor || this.isPastDate(date) || (useExactTime && this.isPastDateTime(date))) {
      return;
    }

    this.openAvailabilityDialog(date, useExactTime);
  }

  private openAvailabilityDialog(date: Date, useExactTime: boolean): void {
    const startTime = useExactTime ? this.formatTime(date) : this.defaultStartTime(date);
    const ref = this.dialog.open(AvailableDateCreateDialogComponent, {
      width: '480px',
      data: {
        scheduledDate: date,
        startTime,
        endTime: useExactTime ? this.formatTime(this.addHoursToDate(date, 1)) : this.addHours(startTime, 1),
      },
      autoFocus: true,
      restoreFocus: true,
      disableClose: true,
    });

    ref.afterClosed().subscribe((result?: Partial<AvailableDate>) => {
      if (!result) return;

      const availableDate: AvailableDate = {
        id: 0,
        advisorId: this.authService.user.advisorId ?? 0,
        scheduledDate: result.scheduledDate ?? '',
        startTime: result.startTime ?? '',
        endTime: result.endTime ?? '',
        status: 'AVAILABLE',
      };

      this.availableDateService.create(availableDate).subscribe({
        next: () => {
          this.toastr.success(
            this.translate.instant('availability.success.created'),
            this.translate.instant('common.success'),
          );
          this.loadCalendar();
        },
        error: () => {
          this.toastr.error(
            this.translate.instant('availability.error.create'),
            this.translate.instant('common.error'),
          );
        },
      });
    });
  }

  private loadCalendar(): void {
    this.loading = true;
    this.errorMessage = '';

    this.appointmentService.getMyAppointments().subscribe({
      next: (appointments) => {
        const futureAppointments = appointments.filter(
          (appointment) => appointment.status !== 'COMPLETED' && !this.isPastAppointment(appointment),
        );

        if (!this.isAdvisor) {
          this.setCalendarData(futureAppointments, []);
          return;
        }

        this.availableDateService.findByAdvisorId(this.authService.user.advisorId ?? undefined).subscribe({
          next: (availableDates) => {
            this.setCalendarData(
              futureAppointments,
              availableDates.filter((date) => date.status?.toUpperCase() === 'AVAILABLE'),
            );
          },
          error: () => {
            this.errorMessage = this.translate.instant('availability.error.load');
            this.loading = false;
          },
        });
      },
      error: () => {
        this.errorMessage = this.translate.instant('calendar.error.load');
        this.loading = false;
      },
    });
  }

  private setCalendarData(appointments: AppointmentDetailed[], availableDates: AvailableDate[]): void {
    const appointmentEvents = appointments
      .map((appointment) => this.toAppointmentEvent(appointment))
      .filter((event): event is CalendarEvent<CalendarMeta> => !!event);
    const availabilityEvents = availableDates
      .map((availableDate) => this.toAvailabilityEvent(availableDate))
      .filter((event): event is CalendarEvent<CalendarMeta> => !!event);

    this.events = [...appointmentEvents, ...availabilityEvents];
    this.upcomingItems = this.toUpcomingItems(appointments, availableDates);
    this.loading = false;
  }

  private toAppointmentEvent(appointment: AppointmentDetailed): CalendarEvent<CalendarMeta> | null {
    const start = this.toDateTime(appointment.scheduledDate, appointment.startTime);
    const end = this.toDateTime(appointment.scheduledDate, appointment.endTime);
    if (!start || !end) return null;

    return {
      start,
      end,
      title: this.isAdvisor
        ? this.translate.instant('appointments.with', { name: appointment.farmerName })
        : this.translate.instant('appointments.with', { name: appointment.advisorName }),
      color: this.appointmentColor,
      cssClass: 'calendar-event-appointment',
      meta: { type: 'appointment', appointmentId: appointment.id },
    };
  }

  private toAvailabilityEvent(availableDate: AvailableDate): CalendarEvent<CalendarMeta> | null {
    const start = this.toDateTime(availableDate.scheduledDate, availableDate.startTime);
    const end = this.toDateTime(availableDate.scheduledDate, availableDate.endTime);
    if (!start || !end) return null;

    return {
      start,
      end,
      title: this.translate.instant('availability.slotAvailable'),
      color: this.availabilityColor,
      cssClass: 'calendar-event-availability',
      meta: { type: 'availability' },
    };
  }

  protected statusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: this.translate.instant('status.pending'),
      ONGOING: this.translate.instant('status.ongoing'),
      COMPLETED: this.translate.instant('status.completed'),
      DISPONIBLE: this.translate.instant('status.available'),
      AVAILABLE: this.translate.instant('status.available'),
      UNAVAILABLE: this.translate.instant('status.unavailable'),
    };

    return labels[status?.toUpperCase()] ?? status;
  }

  private toUpcomingItems(
    appointments: AppointmentDetailed[],
    availableDates: AvailableDate[],
  ): CalendarListItem[] {
    const appointmentItems: CalendarListItem[] = appointments
      .map((appointment): CalendarListItem | null => {
        const date = parseAppointmentDate(appointment.scheduledDate);
        if (!date) return null;

        return {
          id: `appointment-${appointment.id}`,
          title: this.isAdvisor
            ? this.translate.instant('appointments.with', { name: appointment.farmerName })
            : this.translate.instant('appointments.with', { name: appointment.advisorName }),
          date,
          startTime: appointment.startTime ?? '',
          endTime: appointment.endTime ?? '',
          type: 'appointment' as const,
          status: appointment.status,
          appointmentId: appointment.id,
        };
      })
      .filter(this.isCalendarListItem);

    const availabilityItems: CalendarListItem[] = availableDates
      .map((availableDate): CalendarListItem | null => {
        const date = parseAppointmentDate(availableDate.scheduledDate);
        if (!date) return null;

        return {
          id: `availability-${availableDate.id}`,
          title: this.translate.instant('availability.slotAvailable'),
          date,
          startTime: availableDate.startTime,
          endTime: availableDate.endTime,
          type: 'availability' as const,
          status: 'DISPONIBLE',
        };
      })
      .filter(this.isCalendarListItem);

    return [...appointmentItems, ...availabilityItems]
      .filter((item) => !this.isPastDate(item.date))
      .sort((a, b) => {
        const dateDiff = a.date.getTime() - b.date.getTime();
        return dateDiff || a.startTime.localeCompare(b.startTime);
      })
      .slice(0, 6);
  }

  private isCalendarListItem(item: CalendarListItem | null): item is CalendarListItem {
    return item !== null;
  }

  private toDateTime(dateValue?: string, timeValue?: string): Date | null {
    const date = parseAppointmentDate(dateValue);
    if (!date || !timeValue) return null;

    const [hours, minutes] = timeValue.split(':').map((value) => Number(value));
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private isPastAppointment(appointment: AppointmentDetailed): boolean {
    const appointmentDate = parseAppointmentDate(appointment.scheduledDate);
    return this.isPastDate(appointmentDate);
  }

  private isPastDate(date: Date | null): boolean {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const comparableDate = new Date(date);
    comparableDate.setHours(0, 0, 0, 0);
    return comparableDate < today;
  }

  private isPastDateTime(date: Date): boolean {
    return date.getTime() < Date.now();
  }

  private defaultStartTime(date: Date): string {
    const selectedDate = new Date(date);
    const now = new Date();
    const sameDay =
      selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getDate() === now.getDate();

    if (sameDay && selectedDate.getHours() <= now.getHours()) {
      selectedDate.setHours(now.getHours() + 1, 0, 0, 0);
    }

    if (selectedDate.getHours() === 0 && selectedDate.getMinutes() === 0) {
      selectedDate.setHours(9, 0, 0, 0);
    }

    return this.formatTime(selectedDate);
  }

  private addHours(time: string, hoursToAdd: number): string {
    const [hours, minutes] = time.split(':').map((value) => Number(value));
    const date = new Date();
    date.setHours(Math.min(hours + hoursToAdd, 23), minutes || 0, 0, 0);
    return this.formatTime(date);
  }

  private addHoursToDate(date: Date, hoursToAdd: number): Date {
    const nextDate = new Date(date);
    nextDate.setHours(nextDate.getHours() + hoursToAdd);
    return nextDate;
  }

  private formatTime(date: Date): string {
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private shiftDate(direction: -1 | 1): Date {
    const date = new Date(this.viewDate);
    if (this.view === CalendarView.Day) {
      date.setDate(date.getDate() + direction);
    } else if (this.view === CalendarView.Week) {
      date.setDate(date.getDate() + direction * 7);
    } else {
      date.setMonth(date.getMonth() + direction);
    }
    return date;
  }
}
