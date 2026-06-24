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

    try {
      const storedSession = JSON.parse(rawSession) as AuthSession;
      if (!storedSession?.token || !storedSession?.role) {
        this.logout();
        return null;
      }

      this._session = {
        ...storedSession,
        id: storedSession.userId,
        roles: [storedSession.role],
      };
      return this._session;
    } catch {
      this.logout();
      return null;
    }
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
      refreshToken: '',
    };
  }

  public get token(): string | null {
    return this.session?.token ?? null;
  }

  public get refreshToken(): string | null {
    return this.session?.refreshToken ?? null;
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

  refreshSession(refreshToken: string): Observable<AuthSession> {
    return this.httpClient.post<AuthSession>(
      `${this.environmentUrl}/refresh`,
      { refreshToken },
      {
        headers: new HttpHeaders({
          skip: 'true',
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      }
    );
  }

  saveSession(session: AuthSession): void {
    this._session = {
      ...session,
      id: session.userId,
      roles: [session.role],
    };
    localStorage.setItem('session', JSON.stringify(this._session));
  }

  updateTokens(session: AuthSession): void {
    const currentSession = this.session;
    if (!currentSession) {
      this.saveSession(session);
      return;
    }

    this.saveSession({
      ...currentSession,
      ...session,
    });
  }

  isAuthenticated(): boolean {
    return !!this.session?.token;
  }

  logout(): void {
    this._session = null;
    localStorage.removeItem('session');
  }

  hasRole(role: AuthSession['role']): boolean {
    return this.user.role === role;
  }
}
