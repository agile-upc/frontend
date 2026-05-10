import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Profile } from 'src/app/shared/model/profile';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';

// Adaptador para mostrar siempre yyyy-MM-dd en el input del datepicker
export class YMDDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: any): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}

export const YMD_DATE_FORMATS = {
  parse: { dateInput: { year: 'numeric', month: '2-digit', day: '2-digit' } },
  display: {
    dateInput: 'yyyy-MM-dd',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: 'yyyy-MM-dd',
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  providers: [
    { provide: DateAdapter, useClass: YMDDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: YMD_DATE_FORMATS },
  ]
})
export class AppProfileComponent implements OnInit {
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  profile = signal<Profile | null>(null);

  editing = signal<boolean>(false);
  form: FormGroup;

  selectedPhotoFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private fb: FormBuilder,
    private alert: SweetAlertService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      city: [''],
      country: [''],
      birthDate: [null], // usaremos Date aquí
      description: [''],
      occupation: [''],
      experience: [0]
    });
  }

  get isAdvisor(): boolean { return this.authService.user.roles?.includes('ROLE_ADVISOR') ?? false; }
  get isFarmer(): boolean { return this.authService.user.roles?.includes('ROLE_FARMER') ?? false; }

  ngOnInit(): void {
    const userId = this.authService.user.id;
    if (userId == null) {
      this.loading.set(false);
      this.error.set('No se encontró el usuario');
      return;
    }
    this.loadProfile(userId);
  }

  private loadProfile(userId: number) {
    this.loading.set(true);
    this.profileService.fetchProfile(userId).subscribe({
      next: (p) => {
        this.profile.set(p);
        this.patchForm(p);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);
        this.error.set('No se pudo cargar el perfil');
        this.loading.set(false);
      }
    })
  }

  private patchForm(p: Profile) {
    this.form.patchValue({
      firstName: p.firstName,
      lastName: p.lastName,
      city: p.city,
      country: p.country,
      birthDate: p.birthDate ?? null, // mantener Date para el datepicker
      description: p.description,
      occupation: p.occupation,
      experience: p.experience
    });
    this.previewUrl = p.photo || null;
  }

  onEdit(): void {
    this.editing.set(true);
  }

  onCancel(): void {
    const p = this.profile();
    if (p) this.patchForm(p);
    this.editing.set(false);
  }

  private toYMD(date: Date | null | undefined): string {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPhotoFile = input.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedPhotoFile);
    }
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const p = this.profile();
    if (!p) return;

    const birthDate: Date | null = this.form.value.birthDate ?? null;

    const payload = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      city: this.form.value.city,
      country: this.form.value.country,
      birthDate: this.toYMD(birthDate), // enviar yyyy-MM-dd
      description: this.form.value.description,
      photo: p.photo ?? null,
      occupation: this.isAdvisor ? (this.form.value.occupation ?? null) : p.occupation,
      experience: this.isAdvisor ? (Number(this.form.value.experience) ?? 0) : p.experience
    };

    this.profileService.updateProfile(p.id, payload, this.selectedPhotoFile || undefined).subscribe({
      next: (updated) => {
        this.profile.set(updated);
        this.patchForm(updated);
        this.editing.set(false);
        this.alert.saved('Perfil actualizado correctamente');
        this.selectedPhotoFile = null; // limpiar selección tras guardar
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        this.alert.hasServerError('No se pudo actualizar el perfil');
      }
    })
  }

  onDelete(): void { /* pendiente */ }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/profile/user-1.jpg';
  }
}
