import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { TablerIconsModule } from 'angular-tabler-icons';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/material.module';
import { ReviewComponent } from 'src/app/components/catalog/review/review.component';
import { NoDatesDialogComponent } from 'src/app/components/available-dates/no-dates-dialog/no-dates-dialog.component';
import { AvailableDateService } from 'src/app/services/apps/catalog/available-date.service';
import { AdvisorService } from 'src/app/services/apps/catalog/advisor.service';
import { Advisor } from '../advisor';

@Component({
  selector: 'app-advisor-page',
  imports: [MaterialModule, TablerIconsModule, ReviewComponent, NgIf, TranslateModule],
  templateUrl: './advisor-detail.component.html',
  styles: [`
    .advisor-detail-name {
      align-items: center;
      display: inline-flex;
      gap: 8px;
    }

    .advisor-verified {
      color: var(--mat-sys-primary);
    }
  `],
})
export class AppAdvisorDetailComponent implements OnInit {
  advisor!: Advisor;
  hasDates = false;
  draftAppointmentMessage: string | null = null;

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public advisorService: AdvisorService,
    public availableDateService: AvailableDateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.draftAppointmentMessage = params.get('message');
    });

    this.activatedRoute.params.subscribe((params) => {
      const advisorId = Number(params['advisorId']);
      if (advisorId) {
        this.loadAdvisor(advisorId);
        this.loadAvailableDates(advisorId);
      }
    });
  }

  private loadAdvisor(advisorId: number): void {
    this.advisorService.getAdvisor(advisorId).subscribe({
      next: (advisor) => {
        this.advisor = advisor;
      },
      error: (err) => console.error('Error loading advisor:', err)
    });
  }

  private loadAvailableDates(advisorId: number): void {
    this.availableDateService.getAvailableDatesByAdvisor(advisorId).subscribe({
      next: (data) => {
        this.hasDates = data.length > 0;
      },
      error: (err) => console.error('Error loading available dates:', err)
    });
  }

  goToBookingPage(): void {
    if (this.hasDates) {
      const queryParams = this.draftAppointmentMessage
        ? { message: this.draftAppointmentMessage }
        : undefined;

      this.router.navigate(['/apps/farmer/catalog', this.advisor.advisorId, 'book'], { queryParams });
      return;
    }

    this.dialog.open(NoDatesDialogComponent, {
      width: '320px',
      disableClose: false
    });
  }

  protected calculateAge(birthDate: Date): number {
    return moment().diff(birthDate, 'years');
  }
}
