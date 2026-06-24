import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Profile } from 'src/app/shared/model/profile';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private environmentUrl = `${environment.apiUrl}/profiles`;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  public fetchProfiles(): Observable<Profile[]> {
    return this.httpClient.get<any[] | any>(this.environmentUrl).pipe(
      map((response) => (Array.isArray(response) ? response : [response]).map((profile) => this.mapToProfile(profile)))
    );
  }

  public fetchMyProfile(): Observable<Profile> {
    const profileId = this.authService.user.profileId;
    if (!profileId) {
      return this.httpClient.get<any>(this.environmentUrl).pipe(
        map((profile) => this.mapToProfile(profile))
      );
    }

    return this.fetchProfileById(profileId);
  }

  public fetchProfileById(profileId: number): Observable<Profile> {
    return this.httpClient.get<any>(`${this.environmentUrl}/${profileId}`).pipe(
      map((profile) => this.mapToProfile(profile))
    );
  }

  public fetchProfile(id: number): Observable<Profile> {
    const ownProfileId = this.authService.user.profileId;
    if (ownProfileId === id) {
      return this.fetchProfileById(id);
    }

    return this.findProfileByUserId(id).pipe(
      map((profile) => profile ?? new Profile(0, 0, '', '', '', '', new Date(), '', '', null, '', 0))
    );
  }

  public findProfileByUserId(userId: number): Observable<Profile | null> {
    return this.fetchProfiles().pipe(
      map((profiles) => profiles.find((profile) => profile.userId === userId) ?? null)
    );
  }

  public create(profile: Profile, photo: File): Observable<Profile> {
    const formData = new FormData();
    formData.append('firstName', profile.firstName);
    formData.append('lastName', profile.lastName);
    formData.append('city', profile.city);
    formData.append('country', profile.country);
    formData.append('birthDate', this.toYmd(profile.birthDate));
    formData.append('description', profile.description ?? '');
    formData.append('occupation', profile.occupation ?? '');
    formData.append('spokenLanguages', profile.spokenLanguages ?? '');
    formData.append('experience', String(profile.experience ?? 0));
    formData.append('photo', photo);

    return this.httpClient.post<any>(this.environmentUrl, formData).pipe(
      map((createdProfile) => this.mapToProfile(createdProfile))
    );
  }

  public updateProfile(
    id: number,
    payload: {
      firstName: string;
      lastName: string;
      city: string;
      country: string;
      birthDate: string;
      description: string;
      occupation: string | null;
      spokenLanguages: string;
      experience: number | null;
    },
    photoFile?: File
  ): Observable<Profile> {
    const formData = new FormData();
    formData.append('firstName', payload.firstName ?? '');
    formData.append('lastName', payload.lastName ?? '');
    formData.append('city', payload.city ?? '');
    formData.append('country', payload.country ?? '');
    formData.append('birthDate', payload.birthDate ?? '');
    formData.append('description', payload.description ?? '');
    formData.append('spokenLanguages', payload.spokenLanguages ?? '');

    if (payload.occupation != null) {
      formData.append('occupation', payload.occupation);
    }

    if (payload.experience != null) {
      formData.append('experience', String(payload.experience));
    }

    if (photoFile) {
      formData.append('photo', photoFile);
    }

    return this.httpClient.put<any>(`${this.environmentUrl}/${id}`, formData).pipe(
      map((profile) => this.mapToProfile(profile))
    );
  }

  private mapToProfile(profile: any): Profile {
    let birthDate: Date = new Date();
    const birthDateValue = profile?.birthDate;

    if (birthDateValue) {
      if (typeof birthDateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(birthDateValue)) {
        const [year, month, day] = birthDateValue.split('-').map((value: string) => parseInt(value, 10));
        birthDate = new Date(year, month - 1, day);
      } else {
        birthDate = new Date(birthDateValue);
      }
    }

    return new Profile(
      profile?.id ?? 0,
      profile?.userId ?? 0,
      profile?.firstName ?? '',
      profile?.lastName ?? '',
      profile?.city ?? '',
      profile?.country ?? '',
      birthDate,
      profile?.description ?? '',
      profile?.photo ?? '',
      profile?.occupation ?? null,
      profile?.spokenLanguages ?? '',
      profile?.experience ?? 0
    );
  }

  private toYmd(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
