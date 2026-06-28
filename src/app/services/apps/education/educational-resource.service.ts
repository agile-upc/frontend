import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EducationalResource, EducationalResourcePayload } from 'src/app/shared/model/educational-resource';

@Injectable({
  providedIn: 'root',
})
export class EducationalResourceService {
  private readonly resourceUrl = `${environment.apiUrl}/educational-resources`;

  constructor(private httpClient: HttpClient) {}

  getResources(): Observable<EducationalResource[]> {
    return this.httpClient.get<EducationalResource[]>(this.resourceUrl);
  }

  createResource(resource: EducationalResourcePayload): Observable<EducationalResource> {
    return this.httpClient.post<EducationalResource>(this.resourceUrl, resource);
  }

  updateResource(id: number, resource: EducationalResourcePayload): Observable<EducationalResource> {
    return this.httpClient.put<EducationalResource>(`${this.resourceUrl}/${id}`, resource);
  }

  deleteResource(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.resourceUrl}/${id}`);
  }
}
