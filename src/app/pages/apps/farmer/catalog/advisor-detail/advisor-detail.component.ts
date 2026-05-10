import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import {AdvisorService} from "src/app/services/apps/catalog/advisor.service";
import {Advisor} from "../advisor";
import moment from "moment";
import {ReviewComponent} from "src/app/components/catalog/review/review.component";
import {NgIf} from "@angular/common";
import {AvailableDateService} from "src/app/services/apps/catalog/available-date.service";
import { MatDialog } from '@angular/material/dialog';
import { NoDatesDialogComponent } from 'src/app/components/available-dates/no-dates-dialog/no-dates-dialog.component';

@Component({
  selector: 'app-advisor-page',
  imports: [MaterialModule, TablerIconsModule, ReviewComponent, NgIf],
  templateUrl: './advisor-detail.component.html'
})
export class AppAdvisorDetailComponent implements OnInit {
  advisor: Advisor;
  hasDates: boolean = false;
  constructor(public router: Router,
              public activatedRoute: ActivatedRoute,
              public advisorService: AdvisorService,
              public availableDateService: AvailableDateService,
              private dialog: MatDialog) {
              }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const advisorId = params['advisorId'];
      if (advisorId) {
        this.loadAdvisor(advisorId);
        this.loadAvailableDates(advisorId);
      }
    });
  }

  private loadAdvisor(advisorId: number): void {
    this.advisorService.getAdvisor(advisorId).subscribe({
      next: (data) => {
        this.advisor = data;
      },
      error: (err) => {
        console.error('Error loading advisor:', err);
      }
    });
  }

  private loadAvailableDates(advisorId: number): void {
    this.availableDateService.getAvailableDatesByAdvisor(advisorId).subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.hasDates = true;
        }
      },
      error: (err) => {
        console.error('Error loading available dates:', err);
      }
    });
  }

  goToBookingPage(): void {
    if (this.hasDates) {
      this.router.navigate(['/apps/farmer/catalog', this.advisor.advisorId, 'book']);
    }
    else {
      this.dialog.open(NoDatesDialogComponent, {
        width: '320px',
        disableClose: false
      });
    }
  }

  protected calculateAge(birthDate: Date): number {
    return moment().diff(birthDate, 'years');
  }
}
