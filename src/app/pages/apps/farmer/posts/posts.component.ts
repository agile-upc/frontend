import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { PostService } from 'src/app/services/apps/post/post.service';
import { AdvisorService } from 'src/app/services/apps/catalog/advisor.service';
import { Advisor } from '../catalog/advisor';

@Component({
  selector: 'app-posts',
  imports: [TablerIconsModule, CommonModule, MaterialModule],
  templateUrl: './posts.component.html',
  standalone: true,
})
export class AppPostsComponent implements OnInit {
  posts = signal<any[]>([]);
  advisors = signal<Advisor[]>([]);

  constructor(
    public router: Router,
    private postService: PostService,
    private advisorService: AdvisorService,
  ) {}

  ngOnInit(): void {
    this.advisorService.getAdvisorCatalog().subscribe((data) => {
      this.advisors.set(data);
    });

    this.postService.getPosts().subscribe((posts) => {
      this.posts.set(posts);
    });
  }

  getAdvisor(advisorId: number): Advisor {
    return this.advisors().find((advisor) => advisor.advisorId === advisorId) || {
      advisorId,
      userId: 0,
      firstName: 'Asesor',
      lastName: '',
      city: '',
      country: '',
      birthDate: new Date(),
      description: '',
      photo: 'assets/images/profile/user-1.jpg',
      occupation: '',
      experience: 0,
      rating: 0,
    };
  }

  goToAdvisorProfile(advisorId: number) {
    this.router.navigate(['/apps/farmer/catalog/', advisorId]);
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/placeholders/post.jpg';
  }
}
