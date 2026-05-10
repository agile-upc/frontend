export class AvailableDate {
  constructor(
    public dateId: number,
    public advisorId: number,
    public scheduledDate: string,
    public startTime: string,
    public endTime: string,
    public status: boolean,
  ) {}

  static fromDto(dto: any): AvailableDate {
    const dateId = dto.id ?? 0;
    const advisorId = dto.advisorId ?? 0;
    const scheduledDate = dto.scheduledDate;
    const startTime = dto.startTime ?? '';
    const endTime = dto.endTime ?? '';
    const statusRaw = dto.status ?? dto.isAvailable ?? '';
    const status = String(statusRaw).toUpperCase() === 'AVAILABLE' || statusRaw === true;
    return new AvailableDate(dateId, advisorId, scheduledDate, startTime, endTime, status);
  }

  toDto(): any {
    return {
      id: this.dateId,
      advisorId: this.advisorId,
      scheduledDate: this.scheduledDate,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.status ? 'AVAILABLE' : 'UNAVAILABLE',
    };
  }
}
