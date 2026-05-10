import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppointmentDetailed } from 'src/app/pages/apps/farmer/appointment/appointment-detailed';
import {environment} from "../../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private baseUrl = environment.apiUrl + '/appointments';

  constructor(private http: HttpClient) {}

  getMyAppointments(): Observable<AppointmentDetailed[]> {
    // Aquí deberías obtener el farmerId y el token JWT del usuario autenticado
    const farmerId = this.getFarmerId();
    return this.http.get<AppointmentDetailed[]>(`${this.baseUrl}?farmerId=${farmerId}`);
  }

  getMyAdvisorAppointments(): Observable<AppointmentDetailed[]> {
    // Obtener citas del asesor autenticado usando advisorId del localStorage
    const advisorId = this.getAdvisorId();
    return this.http.get<AppointmentDetailed[]>(`${this.baseUrl}?advisorId=${advisorId}`);
  }

  getAllAppointments(): Observable<AppointmentDetailed[]> {
    return this.http.get<AppointmentDetailed[]>(`${this.baseUrl}`);
  }

  getAdvisorAppointments(advisorId: number): Observable<AppointmentDetailed[]> {
    return this.http.get<AppointmentDetailed[]>(`${this.baseUrl}?advisorId=${advisorId}`);
  }

  cancelAppointment(id: number, reason: string): Observable<any> {
    // El backend devuelve texto plano, no JSON
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
  getAppointmentById(id: number): Observable<AppointmentDetailed> {
    return this.http.get<AppointmentDetailed>(`${this.baseUrl}/${id}`);
  }

  bookAppointment(appointment: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, appointment);
  }

  private getFarmerId(): number {
    // Debes obtener el farmerId real del usuario autenticado
    // Esto es un placeholder, reemplázalo por la lógica real
    return Number(localStorage.getItem('farmerId')) || 0;
  }

  private getAdvisorId(): number {
    // Obtener el advisorId del usuario autenticado
    return Number(localStorage.getItem('advisorId')) || 0;
  }
}
