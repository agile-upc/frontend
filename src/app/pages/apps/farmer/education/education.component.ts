import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { TablerIconsModule } from 'angular-tabler-icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/material.module';
import { EducationalResource, EducationalResourceType } from 'src/app/shared/model/educational-resource';
import { EducationalResourceService } from 'src/app/services/apps/education/educational-resource.service';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, TablerIconsModule, TranslateModule],
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
})
export class EducationComponent implements OnInit {
  private originalResources: EducationalResource[] = [];

  resources = signal<EducationalResource[]>([]);
  loading = true;
  error = '';
  searchText = '';
  selectedTypes: EducationalResourceType[] = [];
  selectedTopics: string[] = [];
  readonly typeOptions: EducationalResourceType[] = ['GUIDE', 'MANUAL', 'BOOK', 'VIDEO', 'COURSE', 'TOOL'];

  constructor(
    private educationalResourceService: EducationalResourceService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadResources();
  }

  get topicOptions(): string[] {
    return Array.from(new Set(this.originalResources.flatMap((resource) => resource.topics || []))).sort();
  }

  loadResources(): void {
    this.loading = true;
    this.error = '';
    this.educationalResourceService.getResources()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (resources) => {
          this.originalResources = resources;
          this.applyFilters();
        },
        error: () => {
          this.error = this.translate.instant('education.error.load');
          this.resources.set([]);
        },
      });
  }

  applyFilters(): void {
    const text = this.searchText.trim().toLowerCase();
    const selectedTopics = this.selectedTopics.map((topic) => topic.toLowerCase());
    const filtered = this.originalResources.filter((resource) => {
      const topics = resource.topics || [];
      const textMatch = !text || [
        resource.title,
        resource.summary,
        resource.sourceName,
        topics.join(' '),
      ].join(' ').toLowerCase().includes(text);
      const typeMatch = this.selectedTypes.length === 0 || this.selectedTypes.includes(resource.type);
      const topicMatch = selectedTopics.length === 0 || topics.some((topic) => selectedTopics.includes(topic.toLowerCase()));

      return textMatch && typeMatch && topicMatch;
    });

    this.resources.set(filtered);
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedTypes = [];
    this.selectedTopics = [];
    this.resources.set(this.originalResources);
  }

  openResource(resource: EducationalResource, event?: Event): void {
    event?.stopPropagation();
    window.open(resource.sourceUrl, '_blank', 'noopener,noreferrer');
  }

  openDownload(resource: EducationalResource, event: Event): void {
    event.stopPropagation();
    window.open(resource.downloadUrl || resource.sourceUrl, '_blank', 'noopener,noreferrer');
  }

  getTypeLabel(type: EducationalResourceType): string {
    return this.translate.instant(`education.type.${type.toLowerCase()}`);
  }
}
