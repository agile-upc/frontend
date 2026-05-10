import {Component, OnInit, signal} from '@angular/core';
import {Router} from '@angular/router';
import {PostService} from 'src/app/services/apps/post/post.service';
import {AdvisorService} from 'src/app/services/apps/catalog/advisor.service';
import {TablerIconsModule} from 'angular-tabler-icons';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'src/app/material.module';
import {Advisor} from "../catalog/advisor";

@Component({
  selector: 'app-posts',
  imports: [TablerIconsModule, CommonModule, MaterialModule],
  templateUrl: './posts.component.html',
  standalone: true,
})

export class AppPostsComponent implements OnInit {
  posts = signal<any[]>([]);
  advisors = signal<any[]>([]);

  constructor(
    public router: Router,
    private postService: PostService,
    private advisorService: AdvisorService,
    ) {}

  ngOnInit(): void {
    this.advisorService.getAdvisors().subscribe(data => {
      this.advisors.set(data);
    });

    this.postService.getPosts().subscribe(posts => {
      this.posts.set(posts);
    });
  }

  getAdvisor(advisorId: number): Advisor {
    return this.advisors().find(a => a.advisorId === advisorId) || {
      name: 'Unknown Advisor',
      occupation: '',
      userId: null,
    };
  }


  goToAdvisorProfile(advisorId: number) {
    this.router.navigate(['/apps/farmer/catalog/', advisorId]);
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/placeholders/post.png';
  }

}
