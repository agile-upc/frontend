import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {AvailableDate} from "../../../shared/model/available-date";

@Injectable({
  providedIn: 'root',
})
export class AvailableDateService {
  private environmentUrl = '';

  constructor(private httpClient: HttpClient) {
    this.environmentUrl = `${environment.apiUrl}/available_dates`;
  }

  public findByAdvisorId(advisorId?: number, isAvailable?: boolean): Observable<AvailableDate[]> {
    const params: string[] = [];
    if (advisorId != null) {
      params.push(`advisorId=${advisorId}`);
    }
    if (isAvailable != null) {
      params.push(`isAvailable=${isAvailable}`);
    }
    const query = params.length ? `?${params.join('&')}` : '';
    const url = `${this.environmentUrl}${query}`;
    return this.httpClient.get<AvailableDate[]>(url);
  }

  public findOne(id: number): Observable<AvailableDate> {
    return this.httpClient.get<AvailableDate>(`${this.environmentUrl}/${id}`);
  }

  public create(date: AvailableDate): Observable<AvailableDate> {
    return this.httpClient.post<AvailableDate>(this.environmentUrl, {
      scheduledDate: this.toLocalDateString(date.scheduledDate),
      startTime: date.startTime,
      endTime: date.endTime,
    });
  }

  public update(id: number, date: AvailableDate): Observable<AvailableDate> {
    return this.httpClient.put<AvailableDate>(`${this.environmentUrl}/${id}`, {
      scheduledDate: this.toLocalDateString(date.scheduledDate),
      startTime: date.startTime,
      endTime: date.endTime,
    });
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.environmentUrl}/${id}`, { responseType: 'text' });
  }

  private toLocalDateString(value: string | Date): string {
    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = `${value.getMonth() + 1}`.padStart(2, '0');
      const day = `${value.getDate()}`.padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    return value;
  }
}
