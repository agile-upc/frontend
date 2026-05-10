import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { AppointmentService } from 'src/app/services/apps/appointment/appointment.service';
import { ReviewService } from 'src/app/services/apps/appointment/review.service';
import { FarmerService } from 'src/app/services/apps/catalog/farmer.service';
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
    private farmerService: FarmerService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.loadReviewData();
  }

  loadReviewData(): void {
    this.loading = true;
    this.appointmentService.getAppointmentById(this.data.appointmentId).subscribe({
      next: async (appointment) => {
        try {
          const farmer = await firstValueFrom(this.farmerService.getFarmer(appointment.farmerId));
          const farmerProfile = await firstValueFrom(this.profileService.findProfileByUserId(farmer.userId));
          this.farmerName = farmerProfile ? `${farmerProfile.firstName} ${farmerProfile.lastName}` : `Productor #${appointment.farmerId}`;
          this.farmerPhoto = farmerProfile?.photo || 'assets/images/profile/user-1.jpg';

          const reviews = await firstValueFrom(
            this.reviewService.getReviewByAdvisorAndFarmer(appointment.availableDate.advisorId, appointment.farmerId)
          );
          if (reviews.length > 0) {
            this.rating = reviews[0].rating;
            this.comment = reviews[0].comment;
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
