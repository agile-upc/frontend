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

  public getAdvisor(advisorId: number): Observable<{ id: number; userId: number; rating: number }> {
    return this.httpClient.get<{ id: number; userId: number; rating: number }>(`${this.environmentUrl}/${advisorId}`);
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
    const profile = item?.profile ?? {};
    return new Advisor(
      item?.advisorId ?? 0,
      item?.userId ?? 0,
      profile?.firstName ?? '',
      profile?.lastName ?? '',
      profile?.city ?? '',
      profile?.country ?? '',
      new Date(),
      profile?.description ?? '',
      profile?.photo ?? '',
      profile?.occupation ?? '',
      profile?.experience ?? 0,
      item?.rating ?? 0
    );
  }
}
