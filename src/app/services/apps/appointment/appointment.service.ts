import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AppointmentDetailed } from 'src/app/pages/apps/farmer/appointment/appointment-detailed';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private baseUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  getMyAppointments(): Observable<AppointmentDetailed[]> {
    return this.http.get<AppointmentDetailed[]>(this.baseUrl);
  }

  getMyAdvisorAppointments(): Observable<AppointmentDetailed[]> {
    return this.http.get<AppointmentDetailed[]>(this.baseUrl);
  }

  getAllAppointments(): Observable<AppointmentDetailed[]> {
    return this.http.get<AppointmentDetailed[]>(this.baseUrl);
  }

  cancelAppointment(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getAppointmentById(id: number): Observable<AppointmentDetailed> {
    return this.http.get<AppointmentDetailed>(`${this.baseUrl}/${id}`);
  }

  bookAppointment(appointment: { availableDateId: number; message: string }): Observable<AppointmentDetailed> {
    return this.http.post<AppointmentDetailed>(this.baseUrl, appointment);
  }
}
