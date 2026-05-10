import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/services/apps/post/post.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import {TablerIconsModule} from "angular-tabler-icons";

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatIcon,
    TablerIconsModule
  ],
})
export class EditPostComponent implements OnInit {
  postForm: FormGroup;
  postId: number | null = null;
  currentImageUrl: string | null = null;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private toastr: ToastrService
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: [null],
    });
  }

  selectedFileName: string | null = null;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.postId) {
      this.postService.getPostById(this.postId).subscribe((post) => {
        this.postForm.patchValue({
          title: post.title,
          description: post.description,
        });
        this.currentImageUrl = post.image ?? post.image;
      });
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  savePost(): void {
    if (this.postForm.valid && this.postId) {
      const formData = new FormData();
      formData.append('title', this.postForm.get('title')?.value);
      formData.append('description', this.postForm.get('description')?.value);
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.postService.updatePost(this.postId, formData).subscribe({
        next: (response) => {
          this.toastr.success('Publicación actualizada correctamente.', 'Éxito');
          this.router.navigate(['/apps/advisor/posts']);
        },
        error: (err) => {
          this.toastr.error('Error al actualizar la publicación.', 'Error');
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/apps/advisor/posts']);
  }
}
