export type AdvisorCredentialStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdvisorCredential {
  id: number;
  advisorId: number;
  advisorUserId: number;
  advisorName: string;
  advisorPhoto: string | null;
  certificateName: string;
  issuingInstitution: string;
  evidenceUrl: string;
  status: AdvisorCredentialStatus;
  reviewNotes: string | null;
  reviewedByUserId: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AdvisorCredentialReview {
  status: AdvisorCredentialStatus;
  reviewNotes: string | null;
}
