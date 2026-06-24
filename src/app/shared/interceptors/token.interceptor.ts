import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthSession } from '../model/auth-session';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private refreshing = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request = this.prepareRequest(req);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && this.canAttemptRefresh(req)) {
          return this.refreshAndRetry(request, next);
        }

        if (error.status === 401 && this.authService.isAuthenticated()) {
          this.endSession();
        }

        return throwError(() => error);
      })
    );
  }

  private prepareRequest(req: HttpRequest<any>): HttpRequest<any> {
    const shouldSkip = req.headers.has('skip');
    const cleanHeaders = shouldSkip ? req.headers.delete('skip') : req.headers;

    if (shouldSkip || !this.authService.token) {
      return req.clone({ headers: cleanHeaders });
    }

    return req.clone({
      headers: cleanHeaders.set('Authorization', `Bearer ${this.authService.token}`)
    });
  }

  private canAttemptRefresh(req: HttpRequest<any>): boolean {
    return Boolean(
      this.authService.refreshToken &&
      !req.headers.has('skip') &&
      !req.url.includes('/authentication/refresh') &&
      !req.url.includes('/authentication/sign-in') &&
      !req.url.includes('/authentication/sign-up')
    );
  }

  private refreshAndRetry(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.refreshing) {
      return this.refreshSubject.pipe(
        filter((token): token is string => token !== null),
        take(1),
        switchMap((token) => next.handle(this.withAccessToken(req, token)))
      );
    }

    this.refreshing = true;
    this.refreshSubject.next(null);

    return this.authService.refreshSession(this.authService.refreshToken!).pipe(
      switchMap((session: AuthSession) => {
        this.authService.updateTokens(session);
        this.refreshing = false;
        this.refreshSubject.next(session.token);
        return next.handle(this.withAccessToken(req, session.token));
      }),
      catchError((error) => {
        this.refreshing = false;
        this.endSession();
        return throwError(() => error);
      })
    );
  }

  private withAccessToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  private endSession(): void {
    this.authService.logout();
    Swal.fire('Sesión expirada', 'Su sesión ha caducado, por favor vuelva a ingresar al sistema.', 'warning');
    this.router.navigate(['/authentication/login']);
  }
}
