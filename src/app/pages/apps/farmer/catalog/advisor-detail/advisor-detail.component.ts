import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { ReviewComponent } from 'src/app/components/catalog/review/review.component';
import { NoDatesDialogComponent } from 'src/app/components/available-dates/no-dates-dialog/no-dates-dialog.component';
import { AvailableDateService } from 'src/app/services/apps/catalog/available-date.service';
import { AdvisorService } from 'src/app/services/apps/catalog/advisor.service';
import { Advisor } from '../advisor';

@Component({
  selector: 'app-advisor-page',
  imports: [MaterialModule, TablerIconsModule, ReviewComponent, NgIf],
  templateUrl: './advisor-detail.component.html'
})
export class AppAdvisorDetailComponent implements OnInit {
  advisor!: Advisor;
  hasDates = false;

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public advisorService: AdvisorService,
    public availableDateService: AvailableDateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const advisorId = Number(params['advisorId']);
      if (advisorId) {
        this.loadAdvisor(advisorId);
        this.loadAvailableDates(advisorId);
      }
    });
  }

  private loadAdvisor(advisorId: number): void {
    this.advisorService.getAdvisorCatalog().subscribe({
      next: (advisors) => {
        const advisor = advisors.find((item) => item.advisorId === advisorId);
        if (advisor) {
          this.advisor = advisor;
        }
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
      this.router.navigate(['/apps/farmer/catalog', this.advisor.advisorId, 'book']);
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
