import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Farmer } from 'src/app/components/catalog/review/farmer';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FarmerService {
  private environmentUrl = `${environment.apiUrl}/farmers`;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  public getFarmer(farmerId: number): Observable<Farmer> {
    return this.httpClient.get<Farmer>(`${this.environmentUrl}/${farmerId}`);
  }

  public getMyFarmer(): Observable<Farmer> {
    return this.httpClient.get<Farmer>(this.environmentUrl);
  }

  public getFarmerByUserId(userId: number): Observable<Farmer> {
    if (this.authService.user.userId === userId) {
      return this.getMyFarmer();
    }

    return this.httpClient.get<Farmer[]>(this.environmentUrl).pipe(
      map((farmers) => farmers.find((farmer) => farmer.userId === userId) ?? Farmer.fromDto({}))
    );
  }
}
