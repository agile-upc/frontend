import { Pipe, PipeTransform } from '@angular/core';
import { DateI18nService, LocalizedDateFormat } from 'src/app/services/date-i18n.service';

@Pipe({
  name: 'localizedDate',
  standalone: true,
  pure: false,
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(private dateI18n: DateI18nService) {}

  transform(value: Date | string | null | undefined, format: LocalizedDateFormat = 'longDate'): string {
    return this.dateI18n.format(value, format);
  }
}
