import {Injectable} from "@angular/core";
import {User} from "../model/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user: User | null;
  private _token: string | null;
  private environmentUrl = '';

  constructor(private httpClient: HttpClient) {
    this.environmentUrl = `${environment.apiUrl}/authentication`;
  }

  public get user(): User {
    if (this._user != null) {
      return this._user;
    } else if (this._user == null && localStorage.getItem('user') != null) {
      this._user = JSON.parse(localStorage.getItem('user')!) as User;
      return this._user;
    }
    return new User(0, '', '', []);
  }

  public get token(): string | null {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && localStorage.getItem('token') != null) {
      this._token = localStorage.getItem('token');
      return <string>this._token;
    }
    return null;
  }

  signin(user: User): Observable<any> {
    const urlEndpoint = `${this.environmentUrl}/sign-in`;
    let data = JSON.stringify({ "username": user.username, "password": user.password })
    return this.httpClient.post<any>(urlEndpoint, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      })
    });
  }

  login(user: User): Observable<any> {
    return this.signin(user);
  }

  signup(user: User): Observable<any> {
    const urlEndpoint = `${this.environmentUrl}/sign-up`;
    let data = JSON.stringify({ "username": user.username, "password": user.password, "roles": user.roles })
    return this.httpClient.post<any>(urlEndpoint, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      })
    });
  }

  saveUser(id: number, token: any): void {
    let payload = this.getPayloadToken(token);

    this._user = new User(0,'','',[]);
    this._user.id = id;
    this._user.username = payload.sub;
    this._user.roles = payload.roles;
    // Si el JWT contiene advisorId, lo guardamos
    if (payload.advisorId) {
      this._user.advisorId = payload.advisorId;
      localStorage.setItem('advisorId', String(payload.advisorId));
    }

    localStorage.setItem("user", JSON.stringify(this._user));
  }

  getPayloadToken(accessToken: string | null): any {
    if (accessToken != null) {
      return JSON.parse(this.b64DecodeUnicode(accessToken.split(".")[1]));
    }
    return null;
  }

  b64DecodeUnicode(str: string) {
    return decodeURIComponent(atob(str).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  isAuthenticated(): boolean {
    let payload = this.getPayloadToken(this.token);
    if (payload != null && payload.sub && payload.sub.length > 0) {
      return true;
    }
    return false;
  }

  saveToken(accessToken: string): void {
    this._token = accessToken;
    localStorage.setItem('token', accessToken);
  }

  logout(): void {
    this._token = null;
    this._user = null;
    localStorage.clear();
    /*
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    */
  }

  hasRole(role: string): boolean {
    if (this.user.roles == null) {
      return false;
    }
    return this.user.roles.includes(role);
  }

}
