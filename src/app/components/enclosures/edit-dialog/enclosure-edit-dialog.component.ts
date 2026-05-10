import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Enclosure } from 'src/app/shared/model/enclosure';

@Component({
  selector: 'app-enclosure-edit-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: "enclosure-edit-dialog.component.html",
})
export class AppEnclosureEditDialogComponent {
  form = new FormGroup({
    name: new FormControl(this.data?.name ?? '', [Validators.required]),
    capacity: new FormControl<number | null>(this.data?.capacity ?? 0, [Validators.required, Validators.min(0)]),
    type: new FormControl(this.data?.type ?? '', [Validators.required]),
  });

  constructor(
    private dialogRef: MatDialogRef<AppEnclosureEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Enclosure,
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.dialogRef.close({
      name: value.name?.trim() ?? '',
      capacity: Number(value.capacity ?? 0),
      type: value.type?.trim() ?? '',
    });
  }
}

