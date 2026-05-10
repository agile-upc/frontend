import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) return '';
    // Si ya tiene AM/PM, retorna igual
    if (value.match(/am|pm|AM|PM/)) return value;
    // Asume formato HH:mm
    const [hour, minute] = value.split(':');
    let h = Number(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h.toString().padStart(2, '0')}:${minute} ${ampm}`;
  }
}
