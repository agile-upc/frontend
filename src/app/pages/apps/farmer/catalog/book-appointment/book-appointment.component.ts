import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { AppointmentService } from 'src/app/services/apps/appointment/appointment.service';
import { AvailableDateService } from 'src/app/services/apps/catalog/available-date.service';
import { AdvisorService } from 'src/app/services/apps/catalog/advisor.service';
import { Advisor } from '../advisor';
import { AvailableDate } from './available-date';

@Component({
  selector: 'app-advisor-page',
  imports: [MaterialModule, TablerIconsModule, NgIf, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './book-appointment.component.html'
})
export class AppBookAppointmentComponent implements OnInit {
  protected advisor!: Advisor;
  protected dates: AvailableDate[] = [];

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public advisorService: AdvisorService,
    public availableDateService: AvailableDateService,
    public appointmentService: AppointmentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const advisorId = Number(params['advisorId']);
      if (advisorId) {
        this.loadAdvisor(advisorId);
        this.loadAvailableDates(advisorId);
      }
    });

    this.activatedRoute.queryParamMap.subscribe((params) => {
      const message = params.get('message');
      if (message) {
        this.form.get('comment')!.setValue(message);
      }
    });
  }

  form = new FormGroup({
    date: new FormControl<number>(0, Validators.required),
    comment: new FormControl('', Validators.required),
  });

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
        this.dates = data;
        if (this.dates.length > 0) {
          this.form.get('date')!.setValue(this.dates[0].dateId);
        }
      },
      error: (err) => console.error('Error loading available dates:', err)
    });
  }

  protected calculateAge(birthDate: Date): number {
    return moment().diff(birthDate, 'years');
  }

  protected formatAvailableDate(scheduledDate: string, startTime: string, endTime: string): string {
    return `${moment(scheduledDate, 'YYYY-MM-DD').format('DD MMM YYYY')}, ${startTime} - ${endTime}`;
  }

  protected submit() {
    if (!this.form.valid) {
      return;
    }

    this.appointmentService.bookAppointment({
      availableDateId: this.form.get('date')!.value ?? 0,
      message: this.form.get('comment')!.value ?? '',
    }).subscribe({
      next: () => {
        this.toastr.success('Cita reservada con éxito.', 'Éxito');
        this.router.navigate(['apps/farmer/catalog']);
      },
      error: () => {
        this.toastr.error('Error al reservar la cita. Por favor, inténtelo de nuevo más tarde.', 'Error');
      }
    });
  }
}
