// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";

export interface Review {
  id: number;
  advisorId: number;
  farmerId: number;
  comment: string;
  rating: number;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private baseUrl = environment.apiUrl + '/reviews';

  constructor(private http: HttpClient) {}

  getReviewById(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.baseUrl}/${id}`);
  }

  // Obtener review por advisorId y farmerId usando query params
  getReviewByAdvisorAndFarmer(advisorId: number, farmerId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}?advisorId=${advisorId}&farmerId=${farmerId}`);
  }

  // Obtener todas las reviews de un asesor
  getReviewsByAdvisorId(advisorId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}?advisorId=${advisorId}`);
  }

  createReview(advisorId: number, rating: number, comment: string): Observable<Review> {
    const farmerId = this.getFarmerId();
    return this.http.post<Review>(this.baseUrl, { advisorId, farmerId, rating, comment });
  }

  updateReview(id: number, rating: number, comment: string): Observable<Review> {
    return this.http.put<Review>(`${this.baseUrl}/${id}`, { rating, comment });
  }

  private getFarmerId(): number {
    return Number(localStorage.getItem('farmerId')) || 1;
  }
}
