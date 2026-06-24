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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-side-login',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, BrandingComponent, TablerIconsModule, TranslateModule],
  templateUrl: './side-login.component.html',
  styleUrls: ['./side-login.component.scss']
})
export class AppSideLoginComponent {
  options = this.settings.getOptions();
  user: User = new User('', '');
  hidePassword = true;
  readonly languages = [
    { language: 'Español', code: 'es', shortLabel: 'ES' },
    { language: 'Runasimi', code: 'qu', shortLabel: 'QU' },
    { language: 'Aymar aru', code: 'ay', shortLabel: 'AY' },
  ];
  selectedLanguage = this.languages[0];
  private htmlElement!: HTMLHtmlElement;

  constructor(
    private settings: CoreService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.htmlElement = document.querySelector('html')!;
    const savedLanguage = localStorage.getItem('agrotech-language') ?? this.settings.getLanguage();
    this.selectedLanguage = this.languages.find((lang) => lang.code === savedLanguage) ?? this.languages[0];
    this.translate.addLangs(this.languages.map((lang) => lang.code));
    this.translate.setDefaultLang('es');
    this.translate.use(this.selectedLanguage.code);
    this.dateAdapter.setLocale('es-PE');
    this.applyThemeClass(this.options.theme);
  }

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  setLightDark(theme: string): void {
    this.settings.setOptions({ theme });
    this.options = this.settings.getOptions();
    this.applyThemeClass(theme);
  }

  changeLanguage(lang: { language: string; code: string; shortLabel: string }): void {
    this.selectedLanguage = lang;
    this.translate.use(lang.code);
    this.dateAdapter.setLocale('es-PE');
    this.settings.setLanguage(lang.code);
    localStorage.setItem('agrotech-language', lang.code);
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
        this.toastr.error(
          this.translate.instant('auth.login.errorMessage'),
          this.translate.instant('auth.login.errorTitle'),
        );
      }
    });
  }

  private applyThemeClass(theme: string): void {
    if (theme === 'dark') {
      this.htmlElement.classList.add('dark-theme');
      this.htmlElement.classList.remove('light-theme');
      return;
    }

    this.htmlElement.classList.remove('dark-theme');
    this.htmlElement.classList.add('light-theme');
  }
}
