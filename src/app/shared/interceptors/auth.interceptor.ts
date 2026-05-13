import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { SweetAlertService } from '../services/sweet-alert.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private sweetAlertService: SweetAlertService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          if (this.authService.isAuthenticated()) {
            this.authService.logout();
          }
          Swal.fire('Sesión expirada', 'Su sesión ha caducado, por favor vuelva a ingresar al sistema.', 'warning');
          this.router.navigate(['/authentication/login']);
        } else if (error.status === 403) {
          Swal.fire('Acceso denegado', `Hola ${this.authService.user.username} no tienes acceso a este recurso.`, 'warning');
          this.router.navigate(['/']);
        } else if (error.status === 0) {
          this.sweetAlertService.hasServerError();
        } else if (error.status === 409) {
          Swal.fire(error.error?.message ?? 'Conflicto con el servidor');
        }

        return throwError(() => error);
      })
    );
  }
}
