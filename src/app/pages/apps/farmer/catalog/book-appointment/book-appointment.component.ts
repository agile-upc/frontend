import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MaterialModule} from 'src/app/material.module';
import {TablerIconsModule} from 'angular-tabler-icons';
import {AdvisorService} from "src/app/services/apps/catalog/advisor.service";
import {Advisor} from "../advisor";
import moment from "moment";
import {NgIf} from "@angular/common";
import {AvailableDate} from "./available-date";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AvailableDateService} from "src/app/services/apps/catalog/available-date.service";
import {ToastrService} from "ngx-toastr";
import {AppointmentService} from "src/app/services/apps/appointment/appointment.service";
import {FarmerService} from "src/app/services/apps/catalog/farmer.service";
import {AuthService} from "src/app/shared/services/auth.service";
import {Appointment} from "src/app/shared/model/appointment";

@Component({
  selector: 'app-advisor-page',
  imports: [MaterialModule, TablerIconsModule, NgIf, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './book-appointment.component.html'
})
export class AppBookAppointmentComponent implements OnInit {
  protected advisor: Advisor;
  protected dates: AvailableDate[] = [];
  protected comment: string = '';

  constructor(public router: Router,
              public activatedRoute: ActivatedRoute,
              public authService: AuthService,
              public advisorService: AdvisorService,
              public availableDateService: AvailableDateService,
              public appointmentService: AppointmentService,
              public farmerService: FarmerService,
              private toastr: ToastrService,) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const advisorId = params['advisorId'];
      if (advisorId) {
        this.loadAdvisor(advisorId);
        this.loadAvailableDates(advisorId);
      }
    });
  }

  form = new FormGroup({
    date: new FormControl<number>(0, Validators.required),
    comment: new FormControl('', Validators.required),
  })

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
        this.dates = data;
        if (this.dates.length > 0) {
          console.log(this.dates);
          this.form.get('date')!.setValue(this.dates[0].dateId);
        }
      },
      error: (err) => {
        console.error('Error loading available dates:', err);
      }
    });
  }

  protected calculateAge(birthDate: Date): number {
    return moment().diff(birthDate, 'years');
  }

  protected formatAvailableDate(scheduledDate: string, startTime: string, endTime: string): string {
    const date = moment(scheduledDate, 'YYYY-MM-DD').format('DD MMM YYYY');
    return `${date}, ${startTime} - ${endTime}`;
  }

  protected submit() {
    if (!this.form.valid) return;
    console.log(this.authService.user)
    const userId: number = this.authService.user.id ?? 0;
    if (userId === 0) {
      this.toastr.error('Error al reservar la cita. Por favor, inicie sesión e inténtelo de nuevo.', 'Error');
      return;
    }

    this.farmerService.getFarmerByUserId(userId).subscribe(
      {
        next: (data) => {
          const appointment = new Appointment(
            0,
            this.form.get('date')!.value ?? 0,
            data.farmerId,
            this.form.get('comment')!.value ?? '',
            "",
            ""
          );
          console.log(appointment);
          this.appointmentService.bookAppointment(appointment).subscribe({
            next: (data) => {
              this.toastr.success('Cita reservada con éxito.', 'Éxito');
              // TODO: Redireccionar a la página de confirmación o historial de citas
              this.router.navigate(['apps/farmer/catalog']);
              console.log('Appointment booked successfully:', data);
            },
            error: (err) => {
              this.toastr.error('Error al reservar la cita. Por favor, inténtelo de nuevo más tarde.', 'Error');
              console.error('Error booking appointment:', err);
            }
          });
        },
        error: (err) => {
          console.error('Error getting farmer by user id:', err);
        }
      }
    )
  }
}
