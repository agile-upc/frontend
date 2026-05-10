import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true
})
export class TimeFormatPipe implements PipeTransform {
  transform(time: string): string {
    if (!time) return '';
    
    // Formato esperado: "HH:mm:ss" o "HH:mm"
    const parts = time.split(':');
    if (parts.length < 2) return time;
    
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    
    const period = hours >= 12 ? 'PM' : 'AM';
    
    // Convertir a formato 12 horas
    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours = hours - 12;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes} ${period}`;
  }
}
