import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {SweetAlertService} from "../services/sweet-alert.service";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import Swal from "sweetalert2";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router,
              private sweetAlertService: SweetAlertService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((e: HttpErrorResponse) => {
        if (e.status == 401) {
          if (this.authService.isAuthenticated()) {
            this.authService.logout();
          }
          Swal.fire('Sesión expirada', `Su sesión ha caducado, por favor vuelva a ingresar al sistema.`, 'warning');
          this.router.navigate(['/login']);
        } else if (e.status == 403) {
          Swal.fire('Acceso denegado', `Hola ${this.authService.user.username} no tienes acceso a este recurso.`, 'warning');
          this.router.navigate(['/dashboard']);
        } else if (e.status == 0){
          this.sweetAlertService.hasServerError();
          //this.router.navigate(['/login']);
        }else if(e.status == 409) {
          Swal.fire(e.error.message);
        }
        return throwError(e);

      })
    );
  }


}
