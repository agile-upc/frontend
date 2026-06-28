export type EducationalResourceType = 'GUIDE' | 'MANUAL' | 'BOOK' | 'VIDEO' | 'COURSE' | 'TOOL';

export interface EducationalResource {
  id: number;
  title: string;
  summary: string | null;
  type: EducationalResourceType;
  sourceName: string;
  sourceUrl: string;
  downloadUrl: string | null;
  thumbnailUrl: string | null;
  publishedAt: string | null;
  topics: string[];
}

export type EducationalResourcePayload = Omit<EducationalResource, 'id'>;
