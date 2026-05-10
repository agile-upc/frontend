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

  public findByAdvisorId(advisorId?: number, isAvailable: boolean = true): Observable<AvailableDate[]> {
    const url = advisorId ? `${this.environmentUrl}?advisorId=${advisorId}&isAvailable=${isAvailable}` : this.environmentUrl;
    return this.httpClient.get<AvailableDate[]>(url);
  }

  public findOne(id: number): Observable<AvailableDate> {
    return this.httpClient.get<AvailableDate>(`${this.environmentUrl}/${id}`);
  }

  public create(date: AvailableDate): Observable<AvailableDate> {
    return this.httpClient.post<AvailableDate>(this.environmentUrl, date);
  }

  public update(id: number, date: AvailableDate): Observable<AvailableDate> {
    return this.httpClient.put<AvailableDate>(`${this.environmentUrl}/${id}`, date);
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.environmentUrl}/${id}`, { responseType: 'text' });
  }
}
