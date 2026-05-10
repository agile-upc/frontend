import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import {Enclosure} from "../../../shared/model/enclosure";

@Injectable({ providedIn: 'root' })
export class EnclosureService {
  private environmentUrl = `${environment.apiUrl}/enclosures`;

  constructor(private http: HttpClient) {}

  public getEnclosuresByFarmer(farmerId: number): Observable<Enclosure[]> {
    const url = `${this.environmentUrl}?farmerId=${farmerId}`;
    return this.http.get<Enclosure[]>(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }),
    });
  }

  public updateEnclosure(id: number, payload: Enclosure): Observable<Enclosure> {
    const url = `${this.environmentUrl}/${id}`;
    return this.http.put<Enclosure>(url, JSON.stringify(payload), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }),
    });
  }

  public createEnclosure(payload: Omit<Enclosure, 'id'>): Observable<Enclosure> {
    return this.http.post<Enclosure>(this.environmentUrl, JSON.stringify(payload), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }),
    });
  }

  public deleteEnclosure(id: number): Observable<void> {
    const url = `${this.environmentUrl}/${id}`;
    return this.http.delete(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }),
      observe: 'response',
      responseType: 'text' as 'json',
    }).pipe(map(() => void 0));
  }
}
