import { Component, Input, OnInit } from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { Review, ReviewService } from 'src/app/services/apps/appointment/review.service';
import { FarmerService } from 'src/app/services/apps/catalog/farmer.service';
import { ProfileService } from 'src/app/shared/services/profile.service';

interface EnrichedReview extends Review {
  farmerName: string;
  farmerPhoto: string;
}

@Component({
  selector: 'app-review',
  imports: [MaterialModule, NgForOf, NgClass],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent implements OnInit {
  protected reviews: EnrichedReview[] = [];
  @Input() advisorId!: number;

  constructor(
    private reviewService: ReviewService,
    private farmerService: FarmerService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  private loadReviews(): void {
    this.reviewService.getReviewsByAdvisorId(this.advisorId).subscribe({
      next: async (reviews) => {
        this.reviews = await Promise.all(
          reviews.map(async (review) => {
            try {
              const farmer = await firstValueFrom(this.farmerService.getFarmer(review.farmerId));
              const profile = await firstValueFrom(this.profileService.findProfileByUserId(farmer.userId));
              return {
                ...review,
                farmerName: profile ? `${profile.firstName} ${profile.lastName}` : `Productor #${review.farmerId}`,
                farmerPhoto: profile?.photo || 'assets/images/profile/user-1.jpg'
              };
            } catch {
              return {
                ...review,
                farmerName: `Productor #${review.farmerId}`,
                farmerPhoto: 'assets/images/profile/user-1.jpg'
              };
            }
          })
        );
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
      }
    });
  }
}
