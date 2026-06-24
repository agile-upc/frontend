import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EducationalResource } from 'src/app/shared/model/educational-resource';

@Injectable({
  providedIn: 'root',
})
export class EducationalResourceService {
  private readonly resourceUrl = `${environment.apiUrl}/educational-resources`;

  constructor(private httpClient: HttpClient) {}

  getResources(): Observable<EducationalResource[]> {
    return this.httpClient.get<EducationalResource[]>(this.resourceUrl);
  }
}
