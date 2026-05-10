export interface AppointmentDetailed {
  id: number;
  farmerId: number;
  availableDate: {
    id: number;
    advisorId: number;
    scheduledDate: string;
    startTime: string;
    endTime: string;
    status: 'AVAILABLE' | 'UNAVAILABLE';
  };
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
