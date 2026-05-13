export type AppointmentAvailabilityStatus = 'AVAILABLE' | 'UNAVAILABLE';
export type AppointmentStatus = 'PENDING' | 'ONGOING' | 'COMPLETED';

export interface AppointmentAvailableDate {
  id: number;
  advisorId: number;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentAvailabilityStatus;
}

export interface AppointmentProfileSummary {
  profileId: number;
  userId: number;
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  birthDate: string;
  description: string;
  photo: string;
  occupation: string;
  experience: number;
}

export interface AppointmentDetailed {
  id: number;
  farmerId: number;
  availableDate: AppointmentAvailableDate;
  advisorProfileSummary: AppointmentProfileSummary | null;
  farmerProfileSummary: AppointmentProfileSummary | null;
  message: string;
  status: AppointmentStatus;
  meetingUrl: string;
  advisorId?: number;
  advisorName?: string;
  advisorPhoto?: string;
  farmerName?: string;
  farmerPhoto?: string;
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
}

export interface CreateAppointmentRequest {
  availableDateId: number;
  message: string;
}

export interface UpdateAppointmentRequest {
  message: string;
  status: AppointmentStatus;
}

export function mapAppointmentDetailed(dto: any): AppointmentDetailed {
  const availableDate = {
    id: dto?.availableDate?.id ?? 0,
    advisorId: dto?.availableDate?.advisorId ?? 0,
    scheduledDate: dto?.availableDate?.scheduledDate ?? '',
    startTime: dto?.availableDate?.startTime ?? '',
    endTime: dto?.availableDate?.endTime ?? '',
    status: dto?.availableDate?.status ?? 'UNAVAILABLE',
  } as AppointmentAvailableDate;

  const advisorProfileSummary = dto?.advisorProfileSummary
    ? mapAppointmentProfileSummary(dto.advisorProfileSummary)
    : null;
  const farmerProfileSummary = dto?.farmerProfileSummary
    ? mapAppointmentProfileSummary(dto.farmerProfileSummary)
    : null;

  return {
    id: dto?.id ?? 0,
    farmerId: dto?.farmerId ?? 0,
    availableDate,
    advisorProfileSummary,
    farmerProfileSummary,
    message: dto?.message ?? '',
    status: dto?.status ?? 'PENDING',
    meetingUrl: dto?.meetingUrl ?? '',
    advisorId: availableDate.advisorId,
    advisorName: advisorProfileSummary ? `${advisorProfileSummary.firstName} ${advisorProfileSummary.lastName}` : 'Asesor',
    advisorPhoto: advisorProfileSummary?.photo ?? 'assets/images/profile/user-1.jpg',
    farmerName: farmerProfileSummary ? `${farmerProfileSummary.firstName} ${farmerProfileSummary.lastName}` : `Productor #${dto?.farmerId ?? 0}`,
    farmerPhoto: farmerProfileSummary?.photo ?? 'assets/images/profile/user-1.jpg',
    scheduledDate: availableDate.scheduledDate,
    startTime: availableDate.startTime,
    endTime: availableDate.endTime,
  };
}

function mapAppointmentProfileSummary(dto: any): AppointmentProfileSummary {
  return {
    profileId: dto?.profileId ?? 0,
    userId: dto?.userId ?? 0,
    firstName: dto?.firstName ?? '',
    lastName: dto?.lastName ?? '',
    city: dto?.city ?? '',
    country: dto?.country ?? '',
    birthDate: dto?.birthDate ?? '',
    description: dto?.description ?? '',
    photo: dto?.photo ?? '',
    occupation: dto?.occupation ?? '',
    experience: dto?.experience ?? 0,
  };
}
