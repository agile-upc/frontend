export class Appointment {
  constructor(
    public appointmentId: number,
    public availableDateId: number,
    public farmerId: number,
    public message: string,
    public status: string,
    public meetingUrl: string,
  ){}

  static fromDto(dto: any): Appointment {
    const appointmentId = dto.id ?? 0;
    const availableDateId = dto.availableDateId ?? 0;
    const farmerId = dto.farmerId ?? 0;
    const message = dto.message ?? '';
    const status = dto.status ?? 'PENDING';
    const meetingUrl = dto.meetingUrl ?? '';
    return new Appointment(appointmentId, availableDateId, farmerId, message, status, meetingUrl);
  }
}
