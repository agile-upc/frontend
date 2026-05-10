import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { ReviewService } from 'src/app/services/apps/appointment/review.service';

export interface ReviewDialogData {
  appointmentId: number;
  advisorId: number;
  advisorName: string;
  advisorPhoto?: string;
}

@Component({
  selector: 'app-review-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './review-dialog.component.html',
  styleUrl: './review-dialog.component.scss'
})
export class ReviewDialogComponent implements OnInit {
  rating = 0;
  comment = '';
  loading = false;
  isEdit = false;
  hasReview = false;
  reviewId?: number;

  constructor(
    private dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReviewDialogData,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.checkExistingReview();
  }

  checkExistingReview(): void {
    this.loading = true;
    const farmerId = Number(localStorage.getItem('farmerId'));

    this.reviewService.getReviewByAdvisorAndFarmer(this.data.advisorId, farmerId).subscribe({
      next: (reviews) => {
        if (reviews && reviews.length > 0) {
          const review = reviews[0];
          this.hasReview = true;
          this.isEdit = true;
          this.reviewId = review.id;
          this.rating = review.rating;
          this.comment = review.comment;
        }
        this.loading = false;
      },
      error: () => {
        this.hasReview = false;
        this.loading = false;
      }
    });
  }

  setRating(value: number): void {
    this.rating = value;
  }

  submitReview(): void {
    if (this.rating === 0) {
      return;
    }

    this.loading = true;

    if (this.isEdit && this.reviewId) {
      // Actualizar reseña existente
      this.reviewService.updateReview(this.reviewId, this.rating, this.comment).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      // Crear nueva reseña
      this.reviewService.createReview(this.data.advisorId, this.rating, this.comment).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }
}