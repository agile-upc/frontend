import {ChangeDetectionStrategy, Component, OnInit, signal} from '@angular/core';
import {AvailableDateService} from "src/app/services/apps/appointment/available-date.service";
import {AuthService} from "src/app/shared/services/auth.service";
import {AdvisorService} from "src/app/services/apps/catalog/advisor.service";
import {AvailableDate} from "src/app/shared/model/available-date";
import {TablerIconsModule} from "angular-tabler-icons";
import { MaterialModule } from 'src/app/material.module';
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";
import {
  AvailableDateCreateDialogComponent
} from "src/app/components/available-dates/create-dialog/available-date-create-dialog.component";
import {AppDeleteDialogComponent} from "src/app/shared/components/delete-dialog/delete-dialog.component";

@Component({
  selector: 'app-available-dates',
  imports: [
    MaterialModule,
    TablerIconsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './available-dates.component.html',
  styleUrl: './available-dates.component.scss'
})
export class AvailableDatesComponent implements OnInit {
  availableDates = signal<AvailableDate[]>([]);
  advisorId: number | null = null;

  constructor(
    private availableDateService: AvailableDateService,
    private authService: AuthService,
    private advisorService: AdvisorService,
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) {

  }

  ngOnInit() {
    let userId = this.authService.user.id || 0;

    this.advisorService.getAdvisorByUserId(userId).subscribe({
      next: (advisor) => {
        this.advisorId = advisor.id;
        this.availableDateService.findByAdvisorId(advisor.id).subscribe({
          next: (data) => {
            this.availableDates.set(data);
          }
        })
      },
      error: (err) => {
        console.error('Error fetching advisor by user ID:', err);}
    })
  }

  openDeleteDialog(availableDate: AvailableDate): void {
    const ref = this.dialog.open(AppDeleteDialogComponent, {
      width: '420px',
      data: { id: availableDate.id, name: `${availableDate.scheduledDate}: ${availableDate.startTime} - ${availableDate.endTime}`, type: "horario" },
      autoFocus: false,
      restoreFocus: true,
      disableClose: true,
    });
    ref.afterClosed().subscribe((confirm: boolean) => {
      if (!confirm) return;
      this.availableDateService.delete(availableDate.id).subscribe({
        next: () => {
          this.toastr.success('Horario eliminado', 'Éxito');
          this.availableDates.set(this.availableDates().filter(ad => ad.id !== availableDate.id));
        },
        error: (err) => {
          console.error('No se pudo eliminar el horario:', err);
          this.toastr.error('No se pudo eliminar el horario', 'Error');
        }
      });
    });
  }

  openCreateDialog() {
    const ref = this.dialog.open(AvailableDateCreateDialogComponent, {
      width: '480px',
      autoFocus: true,
      restoreFocus: true,
      disableClose: true,
    });
    ref.afterClosed().subscribe((result?: Partial<AvailableDate>) => {
      if (!result) return;
      if (this.advisorId == null) {
        this.toastr.error('No se pudo determinar el advisorId', 'Error');
        return;
      }
      const availableDate: AvailableDate = {
        id: 0,
        advisorId: this.advisorId,
        scheduledDate: result.scheduledDate ?? '',
        startTime: result.startTime ?? '',
        endTime: result.endTime ?? '',
        status: 'AVAILABLE',
      }

      this.availableDateService.create(availableDate).subscribe({
        next: (created) => {
          this.availableDates.set([created, ...this.availableDates()]);
          this.toastr.success('Horario agregado', 'Éxito');
        },
        error: (err) => {
          console.error('No se pudo agregar el horario:', err);
          this.toastr.error('No se pudo agregar el horario', 'Error');
        }
      });
    });

  }
}
