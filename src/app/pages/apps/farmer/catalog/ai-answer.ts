export class AiAnswer {
  constructor(
    public advisorId: number,
    public response: string
  ) {
  }

  static fromDto(dto: any): AiAnswer {
    const advisorId = dto.advisorId ?? 0;
    const response = dto.response ?? '';
    return new AiAnswer(advisorId, response);
  }
}
