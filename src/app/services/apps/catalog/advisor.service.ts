import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Advisor } from 'src/app/pages/apps/farmer/catalog/advisor';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdvisorService {
  private environmentUrl = `${environment.apiUrl}/advisors`;
  private catalogUrl = `${environment.apiUrl}/advisors/catalog`;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  public getAdvisor(advisorId: number): Observable<Advisor> {
    return this.httpClient.get<any>(`${this.environmentUrl}/${advisorId}`).pipe(
      map((item) => this.mapCatalogItem(item))
    );
  }

  public getMyAdvisor(): Observable<{ id: number; userId: number; rating: number }> {
    return this.httpClient.get<{ id: number; userId: number; rating: number }>(this.environmentUrl);
  }

  public getAdvisorByUserId(userId: number): Observable<{ id: number; userId: number; rating: number }> {
    if (this.authService.user.userId === userId) {
      return this.getMyAdvisor();
    }

    return this.getAdvisorCatalog().pipe(
      map((advisors) => {
        const advisor = advisors.find((item) => item.userId === userId);
        return {
          id: advisor?.advisorId ?? 0,
          userId: advisor?.userId ?? 0,
          rating: advisor?.rating ?? 0,
        };
      })
    );
  }

  public getAdvisorCatalog(): Observable<Advisor[]> {
    return this.httpClient.get<any[]>(this.catalogUrl).pipe(
      map((items) => items.map((item) => this.mapCatalogItem(item)))
    );
  }

  private mapCatalogItem(item: any): Advisor {
    const profile = item?.profile ?? item ?? {};
    return new Advisor(
      item?.advisorId ?? item?.id ?? 0,
      item?.userId ?? profile?.userId ?? 0,
      profile?.firstName ?? '',
      profile?.lastName ?? '',
      profile?.city ?? '',
      profile?.country ?? '',
      this.mapBirthDate(profile?.birthDate),
      profile?.description ?? '',
      profile?.photo ?? '',
      profile?.occupation ?? '',
      profile?.experience ?? 0,
      item?.rating ?? 0
    );
  }

  private mapBirthDate(value: unknown): Date {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split('-').map((part) => parseInt(part, 10));
      return new Date(year, month - 1, day);
    }

    if (value) {
      return new Date(value as string | number | Date);
    }

    return new Date();
  }
}
