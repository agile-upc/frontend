import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, retry, shareReplay, timeout } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Advisor } from 'src/app/pages/apps/farmer/catalog/advisor';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdvisorService {
  private static readonly CACHE_TTL_MS = 60_000;
  private environmentUrl = `${environment.apiUrl}/advisors`;
  private catalogUrl = `${environment.apiUrl}/advisors/catalog`;
  private catalogCache$: Observable<Advisor[]> | null = null;
  private catalogCacheExpiresAt = 0;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  public getAdvisor(advisorId: number): Observable<Advisor> {
    return this.getAdvisorCatalog().pipe(
      map((advisors) => {
        const cachedAdvisor = advisors.find((advisor) => advisor.advisorId === advisorId);
        if (!cachedAdvisor) {
          throw new Error('Advisor not found in catalog cache');
        }
        return cachedAdvisor;
      })
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
    const now = Date.now();
    if (!this.catalogCache$ || now >= this.catalogCacheExpiresAt) {
      this.catalogCache$ = this.httpClient.get<any[]>(this.catalogUrl).pipe(
        timeout(8000),
        retry({ count: 1, delay: 500 }),
        map((items) => items.map((item) => this.mapCatalogItem(item))),
        shareReplay({ bufferSize: 1, refCount: true })
      );
      this.catalogCacheExpiresAt = now + AdvisorService.CACHE_TTL_MS;
    }

    return this.catalogCache$;
  }

  public clearCatalogCache(): void {
    this.catalogCache$ = null;
    this.catalogCacheExpiresAt = 0;
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
      profile?.spokenLanguages ?? '',
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
