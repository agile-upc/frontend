import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthSession } from '../model/auth-session';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private environmentUrl = `${environment.apiUrl}/authentication`;
  private _session: AuthSession | null = null;

  constructor(private httpClient: HttpClient) {}

  public get session(): AuthSession | null {
    if (this._session) {
      return this._session;
    }

    const rawSession = localStorage.getItem('session');
    if (!rawSession) {
      return null;
    }

    const storedSession = JSON.parse(rawSession) as AuthSession;
    this._session = {
      ...storedSession,
      id: storedSession.userId,
      roles: [storedSession.role],
    };
    return this._session;
  }

  public get user(): AuthSession {
    return this.session ?? {
      id: 0,
      userId: 0,
      profileId: null,
      username: '',
      role: 'FARMER',
      roles: ['FARMER'],
      farmerId: null,
      advisorId: null,
      token: '',
    };
  }

  public get token(): string | null {
    return this.session?.token ?? null;
  }

  signin(user: User): Observable<AuthSession> {
    return this.httpClient.post<AuthSession>(
      `${this.environmentUrl}/sign-in`,
      JSON.stringify({ username: user.username, password: user.password }),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      }
    );
  }

  login(user: User): Observable<AuthSession> {
    return this.signin(user);
  }

  signup(data: FormData): Observable<AuthSession> {
    return this.httpClient.post<AuthSession>(`${this.environmentUrl}/sign-up`, data);
  }

  saveSession(session: AuthSession): void {
    this._session = {
      ...session,
      id: session.userId,
      roles: [session.role],
    };
    localStorage.setItem('session', JSON.stringify(this._session));
  }

  isAuthenticated(): boolean {
    return !!this.session?.token;
  }

  logout(): void {
    this._session = null;
    localStorage.clear();
  }

  hasRole(role: AuthSession['role']): boolean {
    return this.user.role === role;
  }
}
