import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {AvailableDate} from "../../../pages/apps/farmer/catalog/book-appointment/available-date";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class AvailableDateService {
  private environmentUrl = '';

  constructor(private httpClient: HttpClient) {
    this.environmentUrl = `${environment.apiUrl}/available_dates`;
  }

  public getAllAvailableDates(): Observable<AvailableDate[]> {
    return this.httpClient.get<AvailableDate[]>(`${this.environmentUrl}?isAvailable=true`)
      .pipe(map(dtos => dtos.map(dto => AvailableDate.fromDto(dto))));
  }

  public getAvailableDatesByAdvisor(advisorId: number): Observable<AvailableDate[]> {
    return this.httpClient.get<AvailableDate[]>(`${this.environmentUrl}?advisorId=${advisorId}&isAvailable=true`)
      .pipe(map(dtos => dtos.map(dto => AvailableDate.fromDto(dto))));
  }

  public getAvailableDateById(id: number): Observable<AvailableDate> {
    return this.httpClient.get<AvailableDate>(`${this.environmentUrl}/${id}`)
      .pipe(map(dto => AvailableDate.fromDto(dto)));
  }
  // String format should be 'YYYY-MM-DD'
  public getAvailableDatesByDate(date: string): Observable<AvailableDate[]> {
    return this.getAllAvailableDates().pipe(
      map(dtos =>
        dtos.filter(d => d.scheduledDate === date)
      )
    );
  }
}
