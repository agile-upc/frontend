import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { UserNotification } from "../model/userNotification";

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private environmentUrl = '';

  constructor(private httpClient: HttpClient) {
    this.environmentUrl = `${environment.apiUrl}/notifications`;
  }

  public fetchNotificationsByUserId(userId: number): Observable<UserNotification[]> {
    const urlEndpoint = `${this.environmentUrl}/${userId}/user`;

    return this.httpClient.get<any[]>(urlEndpoint, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      })
    }).pipe(
      map((notifications: any[]) =>
        notifications.map(n => this.mapToNotification(n))
      )
    );
  }

  public deleteNotification(id: number): Observable<any> {
    return this.httpClient.delete(`${this.environmentUrl}/${id}`, { responseType: 'text' });
  }

  private mapToNotification(n: any): UserNotification {
    return new UserNotification(
      n['id'],
      n['userId'],
      n['title'],
      n['message'],
      new Date(n['sendAt'])
    );
  }
}
