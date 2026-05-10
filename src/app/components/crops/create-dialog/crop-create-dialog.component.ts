import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-crop-create-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: 'crop-create-dialog.component.html',
})
export class AppCropCreateDialogComponent {
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),

    tankMaxVolume: new FormControl<number | null>(0, [
      Validators.required,
      Validators.min(1)
    ]),

    tankHeight: new FormControl<number | null>(0, [
      Validators.required,
      Validators.min(1)
    ]),

    temperatureMaxThreshold: new FormControl<number | null>(0, [
      Validators.required,
      Validators.min(0)
    ]),

    humidityMinThreshold: new FormControl<number | null>(0, [
      Validators.required,
      Validators.min(0)
    ]),
  });

  constructor(private dialogRef: MatDialogRef<AppCropCreateDialogComponent>) {}

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.invalid) return;

    const v = this.form.getRawValue();

    this.dialogRef.close({
      name: v.name?.trim() ?? '',
      tankMaxVolume: Number(v.tankMaxVolume ?? 0),
      temperatureMaxThreshold: Number(v.temperatureMaxThreshold ?? 0),
      humidityMinThreshold: Number(v.humidityMinThreshold ?? 0),
    });
  }
}
