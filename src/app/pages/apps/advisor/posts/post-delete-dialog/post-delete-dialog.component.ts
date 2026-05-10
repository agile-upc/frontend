import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-post-delete-dialog',
  template: `
    <h2 mat-dialog-title>Confirmar eliminación</h2>
    <mat-dialog-content>
      <p>¿Estás seguro de que deseas eliminar esta publicación?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-flat-button class="cancel-btn" (click)="onCancel()">
        Cancelar
      </button>
      <button mat-flat-button class="delete-btn" (click)="onConfirm()">
        <mat-icon>delete</mat-icon> Eliminar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .cancel-btn {
      background-color: #1976d2;
      color: white;
    }

    .cancel-btn:hover {
      background-color: #115293;
    }

    .delete-btn {
      background-color: white;
      color: #d32f2f;
      border: 1px solid #d32f2f;
    }

    .delete-btn:hover {
      background-color: #ffeaea;
    }
  `],
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatIconModule,
    MatDialogTitle
  ],
  standalone: true
})
export class PostDeleteDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<PostDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
