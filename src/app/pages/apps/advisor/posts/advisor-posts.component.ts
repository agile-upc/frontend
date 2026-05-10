import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/apps/post/post.service';
import { AdvisorService } from 'src/app/services/apps/catalog/advisor.service';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import {PostDeleteDialogComponent} from "./post-delete-dialog/post-delete-dialog.component";
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";
import { AppDeleteDialogComponent } from 'src/app/shared/components/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-posts',
  imports: [TablerIconsModule, CommonModule, MaterialModule],
  templateUrl: './advisor-posts.component.html',
  styleUrls: ['./advisor-posts.component.scss'],
  standalone: true,
})
export class AdvisorPostsComponent implements OnInit {
  posts = signal<any[]>([]);
  loggedInAdvisorId: number | null = null;

  constructor(
    public router: Router,
    private postService: PostService,
    private advisorService: AdvisorService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const advisorId = localStorage.getItem('advisorId');
    this.loggedInAdvisorId = advisorId ? parseInt(advisorId, 10) : 0;

    this.postService.getPosts(this.loggedInAdvisorId).subscribe((posts) => {
        this.posts.set(posts);
    });
  }

  editPost(postId: number): void {
    this.router.navigate(['/apps/advisor/posts', postId]);
  }

  deletePost(postId: number): void {
    const ref = this.dialog.open(AppDeleteDialogComponent, {
      width: '420px',
      data: { id: postId, name: `publicación`, type: "publicación" },
      autoFocus: false,
      restoreFocus: true,
      disableClose: true,
    });
    ref.afterClosed().subscribe((confirm: boolean) => {
      if (!confirm) return;
      this.postService.deletePost(postId).subscribe({
        next: () => {
          this.toastr.success('Publicación eliminada', 'Éxito');
          this.posts.set(this.posts().filter(post => post.id !== postId));
        },
        error: (err) => {
          console.error('No se pudo eliminar la publicación:', err);
          this.toastr.error('No se pudo eliminar la publicación', 'Error');
        }
      });
    });
  }


  addPost() {
    this.router.navigate(['/apps/advisor/posts/create']);
  }

}
