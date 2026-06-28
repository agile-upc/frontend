import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AdvisorCredential, AdvisorCredentialReview } from 'src/app/shared/model/advisor-credential';

@Injectable({
  providedIn: 'root',
})
export class AdvisorCredentialService {
  private readonly resourceUrl = `${environment.apiUrl}/advisor-credentials`;

  constructor(private httpClient: HttpClient) {}

  getCredentials(): Observable<AdvisorCredential[]> {
    return this.httpClient.get<AdvisorCredential[]>(this.resourceUrl);
  }

  getMyCredentials(): Observable<AdvisorCredential[]> {
    return this.httpClient.get<AdvisorCredential[]>(`${this.resourceUrl}/me`);
  }

  submitCredential(data: {
    certificateName: string;
    issuingInstitution: string;
    evidenceUrl?: string | null;
    evidenceFile?: File | null;
  }): Observable<AdvisorCredential> {
    const formData = new FormData();
    formData.append('certificateName', data.certificateName);
    formData.append('issuingInstitution', data.issuingInstitution);
    if (data.evidenceUrl) {
      formData.append('evidenceUrl', data.evidenceUrl);
    }
    if (data.evidenceFile) {
      formData.append('evidenceFile', data.evidenceFile);
    }

    return this.httpClient.post<AdvisorCredential>(this.resourceUrl, formData);
  }

  reviewCredential(id: number, review: AdvisorCredentialReview): Observable<AdvisorCredential> {
    return this.httpClient.patch<AdvisorCredential>(`${this.resourceUrl}/${id}/review`, review);
  }
}
