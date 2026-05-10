import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { ReviewService } from 'src/app/services/apps/appointment/review.service';
import { AppointmentService } from 'src/app/services/apps/appointment/appointment.service';
import { AvailableDateService } from 'src/app/services/apps/catalog/available-date.service';
import { ProfileService } from 'src/app/shared/services/profile.service';

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
    private appointmentService: AppointmentService,
    private availableDateService: AvailableDateService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.loadReviewData();
  }

  loadReviewData(): void {
    this.loading = true;

    // 1. Obtener appointment
    this.appointmentService.getAppointmentById(this.data.appointmentId).subscribe({
      next: (appointment) => {
        // 2. Obtener available date para advisorId
        this.availableDateService.getAvailableDateById(appointment.availableDateId).subscribe({
          next: (availableDate: any) => {
            const advisorId = availableDate.advisorId;
            const farmerId = appointment.farmerId;

            // 3. Obtener farmer info
            this.profileService.fetchProfile(appointment.farmerId).subscribe({
              next: (farmerProfile) => {
                this.farmerName = `${farmerProfile.firstName} ${farmerProfile.lastName}`;
                this.farmerPhoto = farmerProfile.photo || 'assets/images/profile/user-1.jpg';

                // 4. Obtener review
                this.reviewService.getReviewByAdvisorAndFarmer(advisorId, farmerId).subscribe({
                  next: (reviews) => {
                    if (reviews && reviews.length > 0) {
                      const review = reviews[0];
                      this.rating = review.rating;
                      this.comment = review.comment;
                    }
                    this.loading = false;
                  },
                  error: () => {
                    this.loading = false;
                  }
                });
              },
              error: () => {
                this.loading = false;
              }
            });
          },
          error: () => {
            this.loading = false;
          }
        });
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