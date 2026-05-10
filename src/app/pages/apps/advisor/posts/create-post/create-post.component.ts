import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/apps/post/post.service';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import {MaterialModule} from "../../../../../material.module";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatIcon
  ],
})
export class CreatePostComponent implements OnInit {
  postForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
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

  ngOnInit(): void {}

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

  createPost(): void {
    if (this.postForm.valid) {
      const advisorId = Number(localStorage.getItem('advisorId') || 0);
      const formData = new FormData();
      formData.append('advisorId', advisorId.toString());
      formData.append('title', this.postForm.get('title')?.value);
      formData.append('description', this.postForm.get('description')?.value);
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.isSaving = true;

      this.postService.createPost(formData as any).subscribe({
        next: (response) => {
          this.toastr.success('Publicación creada', 'Éxito');
          this.router.navigate(['/apps/advisor/posts']);
        },
        error: (err) => {
          console.error('Error al crear post:', err);
          this.toastr.error('Error al crear la publicación', 'Error');
          this.isSaving = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/apps/advisor/posts']);
  }
}
