import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-enclosure-delete-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: "enclosure-delete-dialog.component.html",
})
export class AppEnclosureDeleteDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<AppEnclosureDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; name?: string }
  ) {}

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}

