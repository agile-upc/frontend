import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { DateI18nService } from './date-i18n.service';

@Injectable()
export class MaterialDateI18nAdapter extends NativeDateAdapter {
  constructor(private dateI18n: DateI18nService) {
    super();
  }

  override getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    const names = this.dateI18n.monthNames(style === 'long' ? 'long' : 'short');
    return style === 'narrow' ? names.map((name) => name.charAt(0)) : names;
  }

  override getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    const names = this.dateI18n.weekdayNames(style === 'long' ? 'long' : 'short');
    return style === 'narrow' ? names.map((name) => name.charAt(0)) : names;
  }

  override format(date: Date, displayFormat: unknown): string {
    if (!this.isValid(date)) {
      throw Error('MaterialDateI18nAdapter: Cannot format invalid date.');
    }

    if (this.isMonthYearFormat(displayFormat)) {
      return this.dateI18n.format(date, 'monthYear');
    }

    if (this.isLongDateFormat(displayFormat)) {
      return this.dateI18n.format(date, 'longDate');
    }

    return this.dateI18n.format(date, 'shortDate');
  }

  private isMonthYearFormat(displayFormat: unknown): boolean {
    return this.hasDatePart(displayFormat, 'month') && this.hasDatePart(displayFormat, 'year') && !this.hasDatePart(displayFormat, 'day');
  }

  private isLongDateFormat(displayFormat: unknown): boolean {
    return this.hasDatePart(displayFormat, 'weekday');
  }

  private hasDatePart(displayFormat: unknown, part: string): boolean {
    return typeof displayFormat === 'object' && displayFormat !== null && part in displayFormat;
  }
}
