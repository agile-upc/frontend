import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Crop } from "../../../pages/apps/farmer/crops/crop";
import {CropDto} from "../../../pages/apps/farmer/crops/cropDto";

@Injectable({ providedIn: 'root' })
export class CropService {
  private environmentUrl = `${environment.apiUrl}/crops`;

  constructor(private http: HttpClient) {}

  public getCropsByFarmer(farmerId: number): Observable<Crop[]> {
    const url = `${this.environmentUrl}?farmerId=${farmerId}`;
    return this.http.get<any[]>(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).pipe(map(list => (list ?? []).map(dto => Crop.fromDto(dto))));
  }

  public getCropById(id: number): Observable<Crop> {
    const url = `${this.environmentUrl}/${id}`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).pipe(map(dto => Crop.fromDto(dto)));
  }

  public createCrop(payload: CropDto): Observable<Crop> {
    return this.http.post<any>(this.environmentUrl, JSON.stringify(payload), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).pipe(map(dto => Crop.fromDto(dto)));
  }

  public updateCrop(id: number, payload: CropDto): Observable<Crop> {
    const url = `${this.environmentUrl}/${id}`;
    return this.http.put<any>(url, JSON.stringify(payload), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).pipe(map(dto => Crop.fromDto(dto)));
  }

  public deleteCrop(id: number): Observable<void> {
    const url = `${this.environmentUrl}/${id}`;
    return this.http.delete(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      observe: 'response',
      responseType: 'text' as 'json'
    }).pipe(map(() => void 0));
  }
}
