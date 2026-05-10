import { Injectable } from '@angular/core';
import {Advisor} from "src/app/pages/apps/farmer/catalog/advisor";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {map, switchMap} from "rxjs/operators";
import {ProfileService} from "src/app/shared/services/profile.service";
import {Observable} from "rxjs";
import {Profile} from "src/app/shared/model/profile";

@Injectable({
  providedIn: 'root',
})
export class AdvisorService {
  private environmentUrl = '';

  constructor(private httpClient: HttpClient,
              private profileService: ProfileService,) {
    this.environmentUrl = `${environment.apiUrl}/advisors`;
  }

  public getAdvisor(advisorId: number): Observable<Advisor> {
    return this.httpClient.get<any>(`${this.environmentUrl}/${advisorId}`).pipe(
      switchMap((advisor) =>
        this.profileService.fetchProfile(advisor.userId).pipe(
          map((profile: Profile) =>
            new Advisor(
              advisor.id,
              advisor.userId,
              profile.firstName,
              profile.lastName,
              profile.city,
              profile.country,
              profile.birthDate,
              profile.description,
              profile.photo,
              profile.occupation ?? '',
              profile.experience,
              advisor.rating,
            )
          )
        )
      )
    )
  }

  public getAdvisorByUserId(userId: number): Observable<{ id: number; userId: number; rating: number }> {
    return this.httpClient.get<{ id: number; userId: number; rating: number }>(`${this.environmentUrl}/${userId}/user`);
  }

  public getAdvisors(): Observable<Advisor[]> {
    return this.httpClient.get<any[]>(this.environmentUrl).pipe(
      switchMap((advisors) =>
        this.profileService.fetchAdvisorProfiles().pipe(
          map((profiles) =>
            advisors.map((advisor) => {
              const profile = profiles.find(p => p.userId === advisor.userId);
              return new Advisor(
                advisor.id,
                advisor.userId,
                profile?.firstName ?? '',
                profile?.lastName ?? '',
                profile?.city ?? '',
                profile?.country ?? '',
                profile?.birthDate ?? new Date(),
                profile?.description ?? '',
                profile?.photo ?? '',
                profile?.occupation ?? '',
                profile?.experience ?? 0,
                advisor.rating,
              )
            })
          )
        )
      )
    )
  }
}
