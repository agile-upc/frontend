import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Crop } from '../../../pages/apps/farmer/crops/crop';

@Component({
  selector: 'app-crop-edit-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: 'crop-edit-dialog.component.html',
})
export class AppCropEditDialogComponent {
  form = new FormGroup({
    name: new FormControl(this.data?.name ?? '', [Validators.required]),

    tankMaxVolume: new FormControl<number | null>(
      this.data?.tankMaxVolume ?? 1,
      [Validators.required, Validators.min(1)]
    ),

    tankHeight: new FormControl<number | null>(
      this.data?.tankHeight ?? 1,
      [Validators.required, Validators.min(1)]
    ),

    temperatureMaxThreshold: new FormControl<number | null>(
      this.data?.temperatureMaxThreshold ?? 0,
      [Validators.required, Validators.min(0)]
    ),

    humidityMinThreshold: new FormControl<number | null>(
      this.data?.humidityMinThreshold ?? 0,
      [Validators.required, Validators.min(0)]
    ),
  });

  constructor(
    private dialogRef: MatDialogRef<AppCropEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Crop,
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.invalid) return;

    const v = this.form.getRawValue();

    this.dialogRef.close({
      name: v.name?.trim() ?? '',
      tankMaxVolume: Number(v.tankMaxVolume ?? 0),
      tankHeight: Number(v.tankHeight ?? 0),
      temperatureMaxThreshold: Number(v.temperatureMaxThreshold ?? 0),
      humidityMinThreshold: Number(v.humidityMinThreshold ?? 0),
    });
  }
}
