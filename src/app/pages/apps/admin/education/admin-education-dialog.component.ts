import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { EducationalResource, EducationalResourcePayload, EducationalResourceType } from 'src/app/shared/model/educational-resource';

export interface AdminEducationDialogData {
  resource?: EducationalResource;
  typeOptions: EducationalResourceType[];
}

export interface AdminEducationDialogResult {
  payload: EducationalResourcePayload;
}

@Component({
  selector: 'app-admin-education-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, TablerIconsModule],
  templateUrl: './admin-education-dialog.component.html',
  styleUrl: './admin-education-dialog.component.scss',
})
export class AdminEducationDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AdminEducationDialogComponent, AdminEducationDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: AdminEducationDialogData
  ) {
    const resource = data.resource;
    this.form = this.fb.group({
      title: [resource?.title ?? '', Validators.required],
      summary: [resource?.summary ?? ''],
      type: [resource?.type ?? 'GUIDE', Validators.required],
      sourceName: [resource?.sourceName ?? '', Validators.required],
      sourceUrl: [resource?.sourceUrl ?? '', Validators.required],
      downloadUrl: [resource?.downloadUrl ?? ''],
      thumbnailUrl: [resource?.thumbnailUrl ?? ''],
      publishedAt: [resource?.publishedAt ?? ''],
      topics: [(resource?.topics ?? []).join(', ')],
    });
  }

  get title(): string {
    return this.data.resource ? 'Editar recurso educativo' : 'Nuevo recurso educativo';
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close({ payload: this.toPayload() });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private toPayload(): EducationalResourcePayload {
    return {
      title: this.form.value.title.trim(),
      summary: this.trimToNull(this.form.value.summary),
      type: this.form.value.type,
      sourceName: this.form.value.sourceName.trim(),
      sourceUrl: this.form.value.sourceUrl.trim(),
      downloadUrl: this.trimToNull(this.form.value.downloadUrl),
      thumbnailUrl: this.trimToNull(this.form.value.thumbnailUrl),
      publishedAt: this.trimToNull(this.form.value.publishedAt),
      topics: String(this.form.value.topics ?? '')
        .split(',')
        .map((topic) => topic.trim())
        .filter(Boolean),
    };
  }

  private trimToNull(value: unknown): string | null {
    const text = String(value ?? '').trim();
    return text.length ? text : null;
  }
}
