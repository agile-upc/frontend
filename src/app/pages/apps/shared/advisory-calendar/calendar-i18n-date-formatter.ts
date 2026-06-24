import { Injectable } from '@angular/core';
import { CalendarDateFormatter, DateAdapter, DateFormatterParams } from 'angular-calendar';
import { DateI18nService } from 'src/app/services/date-i18n.service';

@Injectable()
export class CalendarI18nDateFormatter extends CalendarDateFormatter {
  constructor(dateAdapter: DateAdapter, private dateI18n: DateI18nService) {
    super(dateAdapter);
  }

  override monthViewColumnHeader({ date }: DateFormatterParams): string {
    return this.dateI18n.format(date, 'weekdayShort');
  }

  override monthViewDayNumber({ date }: DateFormatterParams): string {
    return this.dateI18n.format(date, 'day');
  }

  override monthViewTitle({ date }: DateFormatterParams): string {
    return this.dateI18n.format(date, 'monthYear');
  }

  override weekViewColumnHeader({ date }: DateFormatterParams): string {
    return this.dateI18n.format(date, 'weekdayShort');
  }

  override weekViewColumnSubHeader({ date }: DateFormatterParams): string {
    return this.dateI18n.format(date, 'weekSubHeader');
  }

  override weekViewTitle({ date }: DateFormatterParams): string {
    return this.dateI18n.format(date, 'monthYear');
  }

  override weekViewHour({ date }: DateFormatterParams): string {
    return this.dateI18n.format(date, 'time');
  }

  override dayViewHour({ date }: DateFormatterParams): string {
    return this.dateI18n.format(date, 'time');
  }

  override dayViewTitle({ date }: DateFormatterParams): string {
    return this.dateI18n.format(date, 'longDate');
  }
}
