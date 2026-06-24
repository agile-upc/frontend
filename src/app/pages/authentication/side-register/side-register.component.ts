import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TablerIconsModule } from 'angular-tabler-icons';
import { BrandingComponent } from '../../../layouts/full/vertical/sidebar/branding.component';
import { MaterialModule } from '../../../material.module';
import { CoreService } from 'src/app/services/core.service';
import { AuthService } from '../../../shared/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-side-register',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, BrandingComponent, NgIf, TablerIconsModule, TranslateModule],
  templateUrl: './side-register.component.html',
  styleUrls: ['./side-register.component.scss']
})
export class AppSideRegisterComponent implements OnInit {
  options = this.settings.getOptions();
  image: File | null = null;
  imageUrl = '';
  imageName = '';
  hidePassword = true;
  readonly languages = [
    { language: 'Español', code: 'es', shortLabel: 'ES' },
    { language: 'Runasimi', code: 'qu', shortLabel: 'QU' },
    { language: 'Aymar aru', code: 'ay', shortLabel: 'AY' },
  ];
  selectedLanguage = this.languages[0];
  readonly languageOptions = [
    { value: 'Español', labelKey: 'language.spanish' },
    { value: 'Quechua', labelKey: 'language.quechua' },
    { value: 'Aymara', labelKey: 'language.aymara' },
  ];
  private htmlElement!: HTMLHtmlElement;

  today = new Date();
  maxBirthDate = new Date(
    this.today.getFullYear() - 18,
    this.today.getMonth(),
    this.today.getDate()
  );

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
    role: new FormControl<'FARMER' | 'ADVISOR'>('FARMER', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    birthDate: new FormControl<Date | null>(null, [Validators.required]),
    description: new FormControl('', []),
    occupation: new FormControl('', []),
    spokenLanguages: new FormControl<string[]>(['Español'], []),
    experience: new FormControl<number | null>(null, []),
    photo: new FormControl('', []),
  });

  ngOnInit() {
    this.form.get('role')?.valueChanges.subscribe(() => this.updateRequirement());
    this.updateRequirement();
  }

  updateRequirement() {
    if (this.form.get('role')?.value === 'ADVISOR') {
      this.form.get('occupation')?.setValidators([Validators.required]);
      this.form.get('experience')?.setValidators([Validators.required, Validators.min(1)]);
      if ((this.form.get('spokenLanguages')?.value ?? []).length === 0) {
        this.form.get('spokenLanguages')?.setValue(['Español']);
      }
    } else {
      this.form.get('occupation')?.clearValidators();
      this.form.get('experience')?.clearValidators();
    }

    this.form.get('occupation')?.updateValueAndValidity();
    this.form.get('experience')?.updateValueAndValidity();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.image = file;
      this.imageName = file.name;
      this.imageUrl = URL.createObjectURL(file);
      this.form.get('photo')?.setValue(this.imageName);
    }
  }

  isAdvisor() {
    return this.form.get('role')?.value === 'ADVISOR';
  }

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

    const formData = new FormData();
    formData.append('username', this.form.value.uname ?? '');
    formData.append('password', this.form.value.password ?? '');
    formData.append('role', this.form.value.role ?? 'FARMER');
    formData.append('firstName', this.form.value.firstName ?? '');
    formData.append('lastName', this.form.value.lastName ?? '');
    formData.append('city', this.form.value.city ?? '');
    formData.append('country', this.form.value.country ?? '');
    formData.append('birthDate', this.toYmd(this.form.value.birthDate));
    formData.append('description', this.form.value.description ?? '');

    if (this.isAdvisor()) {
      formData.append('occupation', this.form.value.occupation ?? '');
      formData.append('experience', String(this.form.value.experience ?? 0));
      formData.append('spokenLanguages', this.normalizedSpokenLanguages().join(', '));
    }

    if (this.image) {
      formData.append('photo', this.image);
    }

    this.authService.signup(formData).subscribe({
      next: (session) => {
        this.authService.saveSession(session);
        this.toastr.success(this.translate.instant('auth.register.successMessage'), this.translate.instant('auth.register.successTitle'));
        this.router.navigate(['']);
      },
      error: () => {
        this.toastr.error(this.translate.instant('auth.register.errorMessage'), this.translate.instant('auth.register.errorTitle'));
      }
    });
  }

  private toYmd(date: Date | null | undefined): string {
    if (!date) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private normalizedSpokenLanguages(): string[] {
    const languages = (this.form.value.spokenLanguages ?? [])
      .map((language) => language.trim())
      .filter(Boolean);

    return languages.length > 0 ? languages : ['Español'];
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
