import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: "delete-dialog.component.html",
  styleUrl: 'delete-dialog.component.scss'
})
export class AppDeleteDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<AppDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; name?: string; type?: string },
  ) {}

  close(result: boolean): void {
    this.dialogRef.close(result);
  }
}

