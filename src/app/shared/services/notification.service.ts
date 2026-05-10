import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserNotification } from '../model/userNotification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private environmentUrl = `${environment.apiUrl}/notifications`;

  constructor(private httpClient: HttpClient) {}

  public fetchNotifications(): Observable<UserNotification[]> {
    return this.httpClient.get<any[]>(this.environmentUrl).pipe(
      map((notifications) => notifications.map((notification) => this.mapToNotification(notification)))
    );
  }

  public fetchNotificationsByUserId(_userId: number): Observable<UserNotification[]> {
    return this.fetchNotifications();
  }

  public deleteNotification(id: number): Observable<string> {
    return this.httpClient.delete(`${this.environmentUrl}/${id}`, { responseType: 'text' });
  }

  private mapToNotification(notification: any): UserNotification {
    return new UserNotification(
      notification?.id ?? 0,
      notification?.userId ?? 0,
      notification?.title ?? '',
      notification?.message ?? '',
      new Date(notification?.sendAt)
    );
  }
}
