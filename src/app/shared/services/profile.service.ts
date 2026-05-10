import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {environment} from "src/environments/environment";
import { Profile } from 'src/app/shared/model/profile';

@Injectable({
  providedIn: 'root',
})

export class ProfileService {
  private environmentUrl = '';

  constructor(private httpClient: HttpClient) {
    this.environmentUrl = `${environment.apiUrl}/profiles`;
  }

  public fetchAdvisorProfiles(): Observable<Profile[]> {
    const urlEndpoint = `${this.environmentUrl}/advisors`;
    return this.httpClient.get<any[]>(urlEndpoint, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      })
    }).pipe(
      map((profiles: any[]) => profiles.map(profile => this.mapToProfile(profile)))
    );
  }

  public fetchProfile(userId: number): Observable<Profile> {
    const urlEndpoint = `${this.environmentUrl}/${userId}/user`;
    return this.httpClient.get(urlEndpoint, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      })
    }).pipe(map(profile => this.mapToProfile(profile)));
  }

  private mapToProfile(profile: any): Profile {
    // Manejo robusto de fecha: si viene como 'YYYY-MM-DD', crear fecha local sin desfase
    let birthDate: Date = new Date();
    const bd = profile['birthDate'];
    if (bd) {
      if (typeof bd === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(bd)) {
        const [y, m, d] = bd.split('-').map((v: string) => parseInt(v, 10));
        birthDate = new Date(y, m - 1, d); // fecha local
      } else {
        birthDate = new Date(bd);
      }
    }

    return new Profile(
      profile['id'],
      profile['userId'],
      profile['firstName'],
      profile['lastName'],
      profile['city'],
      profile['country'],
      birthDate,
      profile['description'],
      profile['photo'],
      profile['occupation'],
      profile['experience']
    );
  }

  public create(profile: Profile, photo: File): Observable<Profile> {
    const urlEndpoint = `${this.environmentUrl}`;
    const formData = new FormData();
    // @ts-ignore
    formData.append('userId', profile.userId);
    formData.append('firstName', profile.firstName);
    formData.append('lastName', profile.lastName);
    formData.append('city', profile.city);
    formData.append('country', profile.country);
    // @ts-ignore
    formData.append('birthDate', profile.birthDate.toISOString().slice(0, 10));
    formData.append('description', profile.description);
    // @ts-ignore
    formData.append('occupation', profile.occupation);
    formData.append('experience', profile.experience?.toString() ?? '0');
    formData.append('photo', photo);

    return this.httpClient.post<any>(urlEndpoint, formData).pipe(
      map(profile => this.mapToProfile(profile))
    );
  }

  public updateProfile(id: number, payload: {
    firstName: string;
    lastName: string;
    city: string;
    country: string;
    birthDate: string; // yyyy-MM-dd
    description: string;
    photo: string | null; // mantenido para compatibilidad, no usado si se pasa File
    occupation: string | null;
    experience: number;
  }, photoFile?: File): Observable<Profile> {
    const urlEndpoint = `${this.environmentUrl}/${id}`;

    const formData = new FormData();
    formData.append('firstName', payload.firstName ?? '');
    formData.append('lastName', payload.lastName ?? '');
    formData.append('city', payload.city ?? '');
    formData.append('country', payload.country ?? '');
    formData.append('birthDate', payload.birthDate ?? '');
    formData.append('description', payload.description ?? '');
    if (payload.occupation !== undefined && payload.occupation !== null) {
      formData.append('occupation', payload.occupation);
    }
    if (payload.experience !== undefined && payload.experience !== null) {
      formData.append('experience', String(payload.experience));
    }
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    return this.httpClient.put<any>(urlEndpoint, formData).pipe(
      map(profile => this.mapToProfile(profile))
    );
  }
}
