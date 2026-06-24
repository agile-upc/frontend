import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {AvailableDate} from "../../../pages/apps/farmer/catalog/book-appointment/available-date";
import {map, retry, shareReplay, timeout} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class AvailableDateService {
  private static readonly CACHE_TTL_MS = 30_000;
  private environmentUrl = '';
  private cache = new Map<string, { expiresAt: number; request$: Observable<AvailableDate[]> }>();

  constructor(private httpClient: HttpClient) {
    this.environmentUrl = `${environment.apiUrl}/available_dates`;
  }

  public getAllAvailableDates(): Observable<AvailableDate[]> {
    return this.fetchAvailableDates(`${this.environmentUrl}?isAvailable=true`);
  }

  public getAvailableDatesByAdvisor(advisorId: number): Observable<AvailableDate[]> {
    return this.fetchAvailableDates(`${this.environmentUrl}?advisorId=${advisorId}&isAvailable=true`);
  }

  public getAvailableDateById(id: number): Observable<AvailableDate> {
    return this.httpClient.get<AvailableDate>(`${this.environmentUrl}/${id}`)
      .pipe(map(dto => AvailableDate.fromDto(dto)));
  }
  // String format should be 'YYYY-MM-DD'
  public getAvailableDatesByDate(date: string): Observable<AvailableDate[]> {
    return this.fetchAvailableDates(`${this.environmentUrl}?scheduledDate=${date}&isAvailable=true`);
  }

  public clearCache(): void {
    this.cache.clear();
  }

  private fetchAvailableDates(url: string): Observable<AvailableDate[]> {
    const now = Date.now();
    const cached = this.cache.get(url);
    if (cached && now < cached.expiresAt) {
      return cached.request$;
    }

    const request$ = this.httpClient.get<AvailableDate[]>(url).pipe(
      timeout(8000),
      retry({ count: 1, delay: 500 }),
      map(dtos => dtos.map(dto => AvailableDate.fromDto(dto))),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.cache.set(url, {
      expiresAt: now + AvailableDateService.CACHE_TTL_MS,
      request$,
    });
    return request$;
  }
}
