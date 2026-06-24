export interface AuthSession {
  id?: number;
  userId: number;
  profileId: number | null;
  username: string;
  role: 'ADMIN' | 'ADVISOR' | 'FARMER';
  roles?: string[];
  farmerId: number | null;
  advisorId: number | null;
  token: string;
  refreshToken: string;
}
