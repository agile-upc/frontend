import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { MatDialogRef } from '@angular/material/dialog';

function parseTimeToMinutes(time: string): number | null {
  if (!time) return null;
  const parts = time.split(':');
  if (parts.length < 2) return null;
  const hh = Number(parts[0]);
  const mm = Number(parts[1]);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return hh * 60 + mm;
}

function setControlError(control: AbstractControl | null, key: string, value: boolean) {
  if (!control) return;
  const errors = control.errors ? { ...control.errors } : {};
  if (value) {
    errors[key] = true;
    control.setErrors(errors);
  } else {
    delete (errors as any)[key];
    const hasKeys = Object.keys(errors).length > 0;
    control.setErrors(hasKeys ? errors : null);
  }
}

function timeRangeValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startCtrl = group.get('startTime');
    const endCtrl = group.get('endTime');
    const dateCtrl = group.get('scheduledDate');

    const startVal: string = startCtrl?.value;
    const endVal: string = endCtrl?.value;
    const dateVal: Date | string | null = dateCtrl?.value;

    // Si faltan valores, limpiamos errores de rango/pasado
    if (!startVal || !endVal || !dateVal) {
      setControlError(startCtrl, 'startInPast', false);
      setControlError(endCtrl, 'endBeforeStart', false);
      setControlError(endCtrl, 'lessThan30', false);
      return null;
    }

    const startMin = parseTimeToMinutes(startVal);
    const endMin = parseTimeToMinutes(endVal);
    if (startMin === null || endMin === null) {
      setControlError(startCtrl, 'startInPast', false);
      setControlError(endCtrl, 'endBeforeStart', false);
      setControlError(endCtrl, 'lessThan30', false);
      return null;
    }

    // Comprueba que start + fecha no sea pasada respecto a ahora (resolución minutos)
    const scheduledDate = new Date(dateVal);
    // normalizar fecha y poner horas/minutos del start
    scheduledDate.setHours(Math.floor(startMin / 60), startMin % 60, 0, 0);

    const now = new Date();
    const nowMinutes = Math.floor(now.getTime() / 60000);
    const scheduledMinutes = Math.floor(scheduledDate.getTime() / 60000);

    if (scheduledMinutes < nowMinutes) {
      // hora de inicio en el pasado
      setControlError(startCtrl, 'startInPast', true);
      // limpiar errores de end relacionados con rango (no aplicar otros checks)
      setControlError(endCtrl, 'endBeforeStart', false);
      setControlError(endCtrl, 'lessThan30', false);
      group.setErrors({ timeRange: 'startInPast' });
      return { timeRange: 'startInPast' };
    } else {
      setControlError(startCtrl, 'startInPast', false);
    }

    const diff = endMin - startMin;
    // end < start
    if (diff < 0) {
      setControlError(endCtrl, 'endBeforeStart', true);
      setControlError(endCtrl, 'lessThan30', false);
      group.setErrors({ timeRange: 'endBeforeStart' });
      return { timeRange: 'endBeforeStart' };
    }

    // diff < 30 minutes
    if (diff < 30) {
      setControlError(endCtrl, 'endBeforeStart', false);
      setControlError(endCtrl, 'lessThan30', true);
      group.setErrors({ timeRange: 'lessThan30' });
      return { timeRange: 'lessThan30' };
    }

    // válido: limpiar errores
    setControlError(startCtrl, 'startInPast', false);
    setControlError(endCtrl, 'endBeforeStart', false);
    setControlError(endCtrl, 'lessThan30', false);
    group.setErrors(null);
    return null;
  };
}

@Component({
  selector: 'app-available-date-create-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: 'available-date-create-dialog.component.html',
})
export class AvailableDateCreateDialogComponent {
  minDate!: Date;

  dateFilter = (d: Date | null): boolean => {
    if (!d) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date >= today;
  };

  form = new FormGroup({
    scheduledDate: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
  },
    { validators: timeRangeValidator() }
  );

  constructor(private dialogRef: MatDialogRef<AvailableDateCreateDialogComponent>) {
    this.minDate = new Date();
    console.log('minDate', this.minDate);
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.dialogRef.close({
      scheduledDate: value.scheduledDate,
      startTime: value.startTime?.trim() ?? '',
      endTime: value.endTime?.trim() ?? '',
    });
  }
}
