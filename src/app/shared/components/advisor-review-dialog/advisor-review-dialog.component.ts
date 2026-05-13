import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { AppointmentService } from 'src/app/services/apps/appointment/appointment.service';
import { ReviewService } from 'src/app/services/apps/appointment/review.service';

export interface AdvisorReviewDialogData {
  appointmentId: number;
}

@Component({
  selector: 'app-advisor-review-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './advisor-review-dialog.component.html',
  styleUrl: './advisor-review-dialog.component.scss'
})
export class AdvisorReviewDialogComponent implements OnInit {
  farmerName = '';
  farmerPhoto = '';
  rating = 0;
  comment = '';
  loading = true;

  constructor(
    private dialogRef: MatDialogRef<AdvisorReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AdvisorReviewDialogData,
    private reviewService: ReviewService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.loadReviewData();
  }

  loadReviewData(): void {
    this.loading = true;
    this.appointmentService.getAppointmentById(this.data.appointmentId).subscribe({
      next: async (appointment) => {
        try {
          this.farmerName = `Productor #${appointment.farmerId}`;
          this.farmerPhoto = 'assets/images/profile/user-1.jpg';

          const reviews = await firstValueFrom(
            this.reviewService.getReviewByAdvisorAndFarmer(appointment.availableDate.advisorId, appointment.farmerId)
          );
          if (reviews.length > 0) {
            const review = reviews[0];
            this.farmerName = review.farmerProfile
              ? `${review.farmerProfile.firstName} ${review.farmerProfile.lastName}`
              : this.farmerName;
            this.farmerPhoto = review.farmerProfile?.photo || this.farmerPhoto;
            this.rating = review.rating;
            this.comment = review.comment;
          }
        } finally {
          this.loading = false;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
