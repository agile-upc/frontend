import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TablerIconsModule } from 'angular-tabler-icons';
import { BrandingComponent } from '../../../layouts/full/vertical/sidebar/branding.component';
import { MaterialModule } from '../../../material.module';
import { CoreService } from 'src/app/services/core.service';
import { User } from '../../../shared/model/user';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-side-login',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, BrandingComponent, TablerIconsModule],
  templateUrl: './side-login.component.html',
  styleUrls: ['./side-login.component.scss']
})
export class AppSideLoginComponent {
  options = this.settings.getOptions();
  user: User = new User('', '');
  hidePassword = true;

  constructor(
    private settings: CoreService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.user = new User(this.form.value.uname!, this.form.value.password!);
    this.authService.login(this.user).subscribe({
      next: (session) => {
        this.authService.saveSession(session);
        this.router.navigate(['']);
      },
      error: () => {
        this.toastr.error('Usuario o contraseña incorrecta', 'Error de autenticación');
      }
    });
  }
}
