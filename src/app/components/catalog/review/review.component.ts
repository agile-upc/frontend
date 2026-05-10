import {Component, Input, OnInit} from '@angular/core';
import {MaterialModule} from "src/app/material.module";
import {ReviewService, Review} from "src/app/services/apps/appointment/review.service";
import {NgClass, NgForOf} from "@angular/common";
import {FarmerService} from "src/app/services/apps/catalog/farmer.service";
import {ProfileService} from "src/app/shared/services/profile.service";

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
  @Input() advisorId: number;

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
        // Enriquecer cada review con datos del farmer
        const enrichedReviews = await Promise.all(
          reviews.map(async (review) => {
            try {
              const farmer = await this.farmerService.getFarmer(review.farmerId).toPromise();
              if (!farmer) {
                throw new Error('Farmer not found');
              }
              const profile = await this.profileService.fetchProfile(farmer.userId).toPromise();
              if (!profile) {
                throw new Error('Profile not found');
              }
              return {
                ...review,
                farmerName: `${profile.firstName} ${profile.lastName}`,
                farmerPhoto: profile.photo || 'assets/images/profile/user-1.jpg'
              };
            } catch (error) {
              console.error('Error loading farmer data:', error);
              return {
                ...review,
                farmerName: 'Usuario',
                farmerPhoto: 'assets/images/profile/user-1.jpg'
              };
            }
          })
        );
        this.reviews = enrichedReviews;
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
      }
    });
  }
}
