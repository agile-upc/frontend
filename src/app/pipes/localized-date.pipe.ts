import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

type LocalizedDateFormat = 'day' | 'shortDate' | 'shortDateTime' | 'shortMonth' | 'longDate' | 'weekdayMonth' | 'monthYear';

@Pipe({
  name: 'localizedDate',
  standalone: true,
  pure: false,
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: Date | string | null | undefined, format: LocalizedDateFormat = 'longDate'): string {
    const date = this.toDate(value);
    if (!date) return '';

    return new Intl.DateTimeFormat(this.locale, this.options(format)).format(date);
  }

  private get locale(): string {
    const lang = this.translate.currentLang || this.translate.defaultLang || 'es';
    return ({ es: 'es-PE', qu: 'qu-PE', ay: 'ay-PE' } as Record<string, string>)[lang] ?? 'es-PE';
  }

  private options(format: LocalizedDateFormat): Intl.DateTimeFormatOptions {
    const formats: Record<LocalizedDateFormat, Intl.DateTimeFormatOptions> = {
      day: { day: '2-digit' },
      shortDate: { day: '2-digit', month: '2-digit', year: 'numeric' },
      shortDateTime: { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' },
      shortMonth: { month: 'short' },
      longDate: { day: 'numeric', month: 'long', year: 'numeric' },
      weekdayMonth: { weekday: 'long', day: 'numeric', month: 'long' },
      monthYear: { month: 'long', year: 'numeric' },
    };

    return formats[format];
  }

  private toDate(value: Date | string | null | undefined): Date | null {
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
}
