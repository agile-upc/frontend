import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { AdvisorCredential, AdvisorCredentialStatus } from 'src/app/shared/model/advisor-credential';
import { AdvisorCredentialService } from 'src/app/services/apps/advisor-credentials/advisor-credential.service';

@Component({
  selector: 'app-admin-credentials',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, TablerIconsModule],
  templateUrl: './admin-credentials.component.html',
  styleUrl: './admin-credentials.component.scss',
})
export class AdminCredentialsComponent implements OnInit {
  credentials = signal<AdvisorCredential[]>([]);
  loading = false;
  statusFilter: AdvisorCredentialStatus | 'ALL' = 'PENDING';
  reviewNotes: Record<number, string> = {};
  readonly statuses: Array<AdvisorCredentialStatus | 'ALL'> = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

  constructor(
    private advisorCredentialService: AdvisorCredentialService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCredentials();
  }

  get filteredCredentials(): AdvisorCredential[] {
    if (this.statusFilter === 'ALL') {
      return this.credentials();
    }

    return this.credentials().filter((credential) => credential.status === this.statusFilter);
  }

  loadCredentials(): void {
    this.loading = true;
    this.advisorCredentialService.getCredentials()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (credentials) => {
          this.credentials.set(credentials);
          this.reviewNotes = Object.fromEntries(credentials.map((credential) => [credential.id, credential.reviewNotes ?? '']));
        },
        error: () => this.toastr.error('No se pudieron cargar las credenciales.', 'Error'),
      });
  }

  review(credential: AdvisorCredential, status: AdvisorCredentialStatus): void {
    this.advisorCredentialService.reviewCredential(credential.id, {
      status,
      reviewNotes: this.reviewNotes[credential.id] ?? null,
    }).subscribe({
      next: (updated) => {
        this.credentials.set(this.credentials().map((item) => item.id === updated.id ? updated : item));
        this.reviewNotes[updated.id] = updated.reviewNotes ?? '';
        this.toastr.success('Validacion actualizada.', 'Exito');
      },
      error: () => this.toastr.error('No se pudo actualizar la validacion.', 'Error'),
    });
  }

  openEvidence(credential: AdvisorCredential): void {
    window.open(credential.evidenceUrl, '_blank', 'noopener,noreferrer');
  }

  statusClass(status: AdvisorCredentialStatus): string {
    return `status-${status.toLowerCase()}`;
  }
}
