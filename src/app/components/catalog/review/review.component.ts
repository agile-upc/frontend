import { Component, Input, OnInit } from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { Review, ReviewService } from 'src/app/services/apps/appointment/review.service';

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

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  private loadReviews(): void {
    this.reviewService.getReviewsByAdvisorId(this.advisorId).subscribe({
      next: (reviews) => {
        this.reviews = reviews.map((review) => ({
          ...review,
          farmerName: review.farmerProfile
            ? `${review.farmerProfile.firstName} ${review.farmerProfile.lastName}`
            : `Productor #${review.farmerId}`,
          farmerPhoto: review.farmerProfile?.photo || 'assets/images/profile/user-1.jpg'
        }));
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
      }
    });
  }
}
