import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { EducationalResource, EducationalResourceType } from 'src/app/shared/model/educational-resource';
import { EducationalResourceService } from 'src/app/services/apps/education/educational-resource.service';
import { AdminEducationDialogComponent, AdminEducationDialogResult } from './admin-education-dialog.component';

@Component({
  selector: 'app-admin-education',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, TablerIconsModule],
  templateUrl: './admin-education.component.html',
  styleUrl: './admin-education.component.scss',
})
export class AdminEducationComponent implements OnInit {
  resources = signal<EducationalResource[]>([]);
  loading = false;
  searchText = '';
  selectedTypes: EducationalResourceType[] = [];
  selectedTopics: string[] = [];
  readonly typeOptions: EducationalResourceType[] = ['GUIDE', 'MANUAL', 'BOOK', 'VIDEO', 'COURSE', 'TOOL'];

  constructor(
    private dialog: MatDialog,
    private educationalResourceService: EducationalResourceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.loading = true;
    this.educationalResourceService.getResources()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (resources) => this.resources.set(resources),
        error: () => this.toastr.error('No se pudieron cargar los recursos educativos.', 'Error'),
      });
  }

  get topicOptions(): string[] {
    return Array.from(new Set(this.resources().flatMap((resource) => resource.topics || []))).sort();
  }

  get filteredResources(): EducationalResource[] {
    const search = this.searchText.trim().toLowerCase();
    const selectedTopics = this.selectedTopics.map((topic) => topic.toLowerCase());

    return this.resources().filter((resource) => {
      const topics = resource.topics || [];
      const textMatch = !search || [
        resource.title,
        resource.summary,
        resource.sourceName,
        resource.sourceUrl,
        topics.join(' '),
      ].join(' ').toLowerCase().includes(search);
      const typeMatch = this.selectedTypes.length === 0 || this.selectedTypes.includes(resource.type);
      const topicMatch = selectedTopics.length === 0 || topics.some((topic) => selectedTopics.includes(topic.toLowerCase()));

      return textMatch && typeMatch && topicMatch;
    });
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedTypes = [];
    this.selectedTopics = [];
  }

  openCreateDialog(): void {
    this.openDialog();
  }

  openEditDialog(resource: EducationalResource): void {
    this.openDialog(resource);
  }

  private openDialog(resource?: EducationalResource): void {
    const ref = this.dialog.open(AdminEducationDialogComponent, {
      width: '720px',
      maxWidth: 'calc(100vw - 32px)',
      data: { resource, typeOptions: this.typeOptions },
      autoFocus: true,
      restoreFocus: true,
      disableClose: true,
    });

    ref.afterClosed().subscribe((result?: AdminEducationDialogResult) => {
      if (!result) return;

      const request = resource
        ? this.educationalResourceService.updateResource(resource.id, result.payload)
        : this.educationalResourceService.createResource(result.payload);

      request.subscribe({
        next: (savedResource) => {
          if (resource) {
            this.resources.set(this.resources().map((item) => item.id === savedResource.id ? savedResource : item));
            this.toastr.success('Recurso educativo actualizado.', 'Exito');
          } else {
            this.resources.set([savedResource, ...this.resources()]);
            this.toastr.success('Recurso educativo creado.', 'Exito');
          }
        },
        error: () => this.toastr.error('No se pudo guardar el recurso educativo.', 'Error'),
      });
    });
  }

  deleteResource(resource: EducationalResource): void {
    if (!window.confirm(`Eliminar "${resource.title}"?`)) {
      return;
    }

    this.educationalResourceService.deleteResource(resource.id).subscribe({
      next: () => {
        this.resources.set(this.resources().filter((item) => item.id !== resource.id));
        this.toastr.success('Recurso educativo eliminado.', 'Exito');
      },
      error: () => this.toastr.error('No se pudo eliminar el recurso educativo.', 'Error'),
    });
  }

  openResource(resource: EducationalResource): void {
    window.open(resource.sourceUrl, '_blank', 'noopener,noreferrer');
  }
}
