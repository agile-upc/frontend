import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Animal } from 'src/app/shared/model/animal';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AnimalService {
  private environmentUrl = `${environment.apiUrl}/animals`;

  constructor(private http: HttpClient) {}

  public getAnimalsByEnclosure(enclosureId: number): Observable<Animal[]> {
    const url = `${this.environmentUrl}?enclosureId=${enclosureId}`;
    return this.http.get<Animal[]>(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }),
    });
  }

  public getAnimalById(id: number): Observable<Animal> {
    const url = `${this.environmentUrl}/${id}`;
    return this.http.get<Animal>(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }),
    });
  }

  public updateAnimal(id: number, payload: Animal): Observable<Animal> {
    const url = `${this.environmentUrl}/${id}`;
    return this.http.put<Animal>(url, JSON.stringify(payload), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }),
    });
  }

  public createAnimal(payload: Omit<Animal, 'id'>): Observable<Animal> {
    return this.http.post<Animal>(this.environmentUrl, JSON.stringify(payload), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }),
    });
  }

  public deleteAnimal(id: number): Observable<void> {
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
