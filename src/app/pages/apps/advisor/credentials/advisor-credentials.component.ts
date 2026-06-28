import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { AdvisorCredential, AdvisorCredentialStatus } from 'src/app/shared/model/advisor-credential';
import { AdvisorCredentialService } from 'src/app/services/apps/advisor-credentials/advisor-credential.service';

@Component({
  selector: 'app-advisor-credentials',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, TablerIconsModule],
  templateUrl: './advisor-credentials.component.html',
  styleUrl: './advisor-credentials.component.scss',
})
export class AdvisorCredentialsComponent implements OnInit {
  credentials = signal<AdvisorCredential[]>([]);
  loading = false;
  saving = false;
  selectedFile: File | null = null;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private advisorCredentialService: AdvisorCredentialService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      certificateName: ['', Validators.required],
      issuingInstitution: ['', Validators.required],
      evidenceUrl: [''],
    });
  }

  ngOnInit(): void {
    this.loadCredentials();
  }

  get isValidated(): boolean {
    return this.credentials().some((credential) => credential.status === 'APPROVED');
  }

  loadCredentials(): void {
    this.loading = true;
    this.advisorCredentialService.getMyCredentials()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (credentials) => this.credentials.set(credentials),
        error: () => this.toastr.error('No se pudieron cargar tus credenciales.', 'Error'),
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  submit(): void {
    if (this.form.invalid || (!this.form.value.evidenceUrl && !this.selectedFile)) {
      this.form.markAllAsTouched();
      this.toastr.warning('Agrega una URL o archivo de evidencia.', 'Validacion');
      return;
    }

    this.saving = true;
    this.advisorCredentialService.submitCredential({
      certificateName: this.form.value.certificateName.trim(),
      issuingInstitution: this.form.value.issuingInstitution.trim(),
      evidenceUrl: this.form.value.evidenceUrl?.trim() || null,
      evidenceFile: this.selectedFile,
    }).pipe(finalize(() => this.saving = false))
      .subscribe({
        next: (credential) => {
          this.credentials.set([credential, ...this.credentials()]);
          this.form.reset({ certificateName: '', issuingInstitution: '', evidenceUrl: '' });
          this.selectedFile = null;
          this.toastr.success('Credencial enviada para revision.', 'Exito');
        },
        error: () => this.toastr.error('No se pudo enviar la credencial.', 'Error'),
      });
  }

  openEvidence(credential: AdvisorCredential): void {
    window.open(credential.evidenceUrl, '_blank', 'noopener,noreferrer');
  }

  statusClass(status: AdvisorCredentialStatus): string {
    return `status-${status.toLowerCase()}`;
  }
}
