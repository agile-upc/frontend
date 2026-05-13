import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AppointmentDetailed,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  mapAppointmentDetailed
} from 'src/app/pages/apps/farmer/appointment/appointment-detailed';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private baseUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  getMyAppointments(): Observable<AppointmentDetailed[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map((appointments) => appointments.map((appointment) => mapAppointmentDetailed(appointment)))
    );
  }

  getMyAdvisorAppointments(): Observable<AppointmentDetailed[]> {
    return this.getMyAppointments();
  }

  getAllAppointments(): Observable<AppointmentDetailed[]> {
    return this.getMyAppointments();
  }

  cancelAppointment(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getAppointmentById(id: number): Observable<AppointmentDetailed> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map((appointment) => mapAppointmentDetailed(appointment))
    );
  }

  bookAppointment(appointment: CreateAppointmentRequest): Observable<AppointmentDetailed> {
    return this.http.post<any>(this.baseUrl, appointment).pipe(
      map((createdAppointment) => mapAppointmentDetailed(createdAppointment))
    );
  }

  updateAppointment(id: number, appointment: UpdateAppointmentRequest): Observable<AppointmentDetailed> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, appointment).pipe(
      map((updatedAppointment) => mapAppointmentDetailed(updatedAppointment))
    );
  }
}
