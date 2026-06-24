import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { AppDeleteDialogComponent } from 'src/app/shared/components/delete-dialog/delete-dialog.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PostService } from 'src/app/services/apps/post/post.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-posts',
  imports: [TablerIconsModule, CommonModule, MaterialModule, TranslateModule],
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
    private authService: AuthService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loggedInAdvisorId = this.authService.user.advisorId;
    this.postService.getPosts().subscribe((posts) => {
      this.posts.set(
        this.loggedInAdvisorId == null
          ? []
          : posts.filter((post) => post.advisorId === this.loggedInAdvisorId)
      );
    });
  }

  editPost(postId: number): void {
    this.router.navigate(['/apps/advisor/posts', postId]);
  }

  deletePost(postId: number): void {
    const ref = this.dialog.open(AppDeleteDialogComponent, {
      width: '420px',
      data: { id: postId, name: this.translate.instant('posts.singular'), type: this.translate.instant('posts.singular') },
      autoFocus: false,
      restoreFocus: true,
      disableClose: true,
    });

    ref.afterClosed().subscribe((confirm: boolean) => {
      if (!confirm) return;

      this.postService.deletePost(postId).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('posts.success.deleted'), this.translate.instant('common.success'));
          this.posts.set(this.posts().filter((post) => post.id !== postId));
        },
        error: (err) => {
          console.error('No se pudo eliminar la publicación:', err);
          this.toastr.error(this.translate.instant('posts.error.delete'), this.translate.instant('common.error'));
        }
      });
    });
  }

  addPost() {
    this.router.navigate(['/apps/advisor/posts/create']);
  }
}
