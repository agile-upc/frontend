import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-enclosure-create-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: "enclosure-create-dialog.component.html",
})

export class AppEnclosureCreateDialogComponent {
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    capacity: new FormControl<number | null>(0, [Validators.required, Validators.min(0)]),
    type: new FormControl('', [Validators.required]),
  });

  constructor(private dialogRef: MatDialogRef<AppEnclosureCreateDialogComponent>) {}

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

