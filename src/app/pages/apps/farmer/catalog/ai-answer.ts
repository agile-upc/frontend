export type RecommendationStatus = 'READY' | 'NEEDS_MORE_INFO' | 'UNAVAILABLE';

export interface AiRecommendationMatch {
  advisorId: number;
  fullName: string;
  occupation: string;
  rating: number;
  experience: number;
  city: string;
  country: string;
  nextAvailableDate: string | null;
  why: string;
}

export class AiAnswer {
  constructor(
    public status: RecommendationStatus,
    public selectedAdvisorId: number | null,
    public matches: AiRecommendationMatch[],
    public summary: string | null,
    public clarifyingQuestion: string | null,
    public draftAppointmentMessage: string | null,
    public conversationId: string | null,
    public questionsAsked: number,
    public maxQuestions: number,
    public usedFallback: boolean
  ) {}

  static fromDto(dto: any): AiAnswer {
    return new AiAnswer(
      dto?.status ?? 'UNAVAILABLE',
      dto?.selectedAdvisorId ?? null,
      Array.isArray(dto?.matches)
        ? dto.matches.map((match: any) => ({
            advisorId: match?.advisorId ?? 0,
            fullName: match?.fullName ?? '',
            occupation: match?.occupation ?? '',
            rating: match?.rating ?? 0,
            experience: match?.experience ?? 0,
            city: match?.city ?? '',
            country: match?.country ?? '',
            nextAvailableDate: match?.nextAvailableDate ?? null,
            why: match?.why ?? ''
          }))
        : [],
      dto?.summary ?? null,
      dto?.clarifyingQuestion ?? null,
      dto?.draftAppointmentMessage ?? null,
      dto?.conversationId ?? null,
      dto?.questionsAsked ?? 0,
      dto?.maxQuestions ?? 1,
      dto?.usedFallback ?? false
    );
  }
}
