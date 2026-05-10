export interface AppointmentDetailed {
  id: number;
  farmerId: number;
  availableDateId: number;
  message: string;
  status: 'PENDING' | 'ONGOING' | 'COMPLETED';
  meetingUrl: string;
  advisorId?: number;
  advisorName?: string;
  advisorPhoto?: string;
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
}
