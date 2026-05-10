import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface EnclosureInfoData {
  name: string;
  capacity: number;
  type: string;
}

@Component({
  selector: 'app-enclosure-info-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: "enclosure-info-dialog.component.html",
})
export class AppEnclosureInfoDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<AppEnclosureInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EnclosureInfoData,
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}

