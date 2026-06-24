import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type LocalizedDateFormat =
  | 'day'
  | 'shortDate'
  | 'shortDateTime'
  | 'shortMonth'
  | 'longDate'
  | 'weekdayMonth'
  | 'monthYear'
  | 'weekdayShort'
  | 'weekdayLong'
  | 'weekSubHeader'
  | 'time';

@Injectable({ providedIn: 'root' })
export class DateI18nService {
  constructor(private translate: TranslateService) {}

  format(value: Date | string | null | undefined, format: LocalizedDateFormat = 'longDate'): string {
    const date = this.toDate(value);
    if (!date) return '';

    const day = date.getDate();
    const paddedDay = String(day).padStart(2, '0');
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const weekdayIndex = date.getDay();
    const params = {
      day,
      paddedDay,
      month: this.monthName(monthIndex, 'long'),
      shortMonth: this.monthName(monthIndex, 'short'),
      year,
      weekday: this.weekdayName(weekdayIndex, 'long'),
      shortWeekday: this.weekdayName(weekdayIndex, 'short'),
      time: this.formatTime(date),
    };

    if (format === 'day') return paddedDay;
    if (format === 'shortDate') return `${paddedDay}/${String(monthIndex + 1).padStart(2, '0')}/${year}`;
    if (format === 'shortDateTime') return `${this.format(date, 'shortDate')}, ${params.time}`;
    if (format === 'shortMonth') return String(params.shortMonth);
    if (format === 'weekdayShort') return String(params.shortWeekday);
    if (format === 'weekdayLong') return String(params.weekday);
    if (format === 'time') return String(params.time);

    return this.translate.instant(`date.formats.${format}`, params);
  }

  toDate(value: Date | string | null | undefined): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;

    const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (dateOnly) {
      const [, year, month, day] = dateOnly;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private monthName(index: number, width: 'long' | 'short'): string {
    return this.monthNames(width)[index];
  }

  private weekdayName(index: number, width: 'long' | 'short'): string {
    return this.weekdayNames(width)[index];
  }

  monthNames(width: 'long' | 'short'): string[] {
    const months = this.translate.instant(`date.months.${width}`);
    return Array.isArray(months) && months.length === 12 ? months : this.fallbackMonths[width];
  }

  weekdayNames(width: 'long' | 'short'): string[] {
    const weekdays = this.translate.instant(`date.weekdays.${width}`);
    return Array.isArray(weekdays) && weekdays.length === 7 ? weekdays : this.fallbackWeekdays[width];
  }

  private formatTime(date: Date): string {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  private readonly fallbackMonths = {
    long: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    short: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  };

  private readonly fallbackWeekdays = {
    long: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    short: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  };
}
