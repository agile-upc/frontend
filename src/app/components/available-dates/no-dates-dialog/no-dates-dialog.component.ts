import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-no-dates-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: 'no-dates-dialog.component.html',
  styleUrls: ['no-dates-dialog.component.scss']
})
export class NoDatesDialogComponent {
  constructor(private dialogRef: MatDialogRef<NoDatesDialogComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
