import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {Farmer} from "src/app/components/catalog/review/farmer";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class FarmerService {
  private environmentUrl = '';

  constructor(private httpClient: HttpClient) {
    this.environmentUrl = `${environment.apiUrl}/farmers`;
  }

  public getFarmer(farmerId: number): Observable<Farmer> {
    return this.httpClient.get<Farmer>(this.environmentUrl + `/${farmerId}`);
  }

  public getFarmerByUserId(userId: number): Observable<Farmer> {
    return this.httpClient.get<Farmer>(this.environmentUrl + `/${userId}/user`)
      .pipe(map(dto => Farmer.fromDto(dto)));
  }
}
