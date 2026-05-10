export interface AvailableDate {
  id: number;
  advisorId: number;
  scheduledDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: string;
}
