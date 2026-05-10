import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { AvailableDateCreateDialogComponent } from 'src/app/components/available-dates/create-dialog/available-date-create-dialog.component';
import { AppDeleteDialogComponent } from 'src/app/shared/components/delete-dialog/delete-dialog.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AvailableDate } from 'src/app/shared/model/available-date';
import { AvailableDateService } from 'src/app/services/apps/appointment/available-date.service';

@Component({
  selector: 'app-available-dates',
  imports: [MaterialModule, TablerIconsModule],
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
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.advisorId = this.authService.user.advisorId;
    this.loadAvailableDates();
  }

  private loadAvailableDates(): void {
    this.availableDateService.findByAdvisorId(this.advisorId ?? undefined).subscribe({
      next: (data) => this.availableDates.set(data),
      error: (err) => console.error('Error fetching available dates:', err)
    });
  }

  openDeleteDialog(availableDate: AvailableDate): void {
    const ref = this.dialog.open(AppDeleteDialogComponent, {
      width: '420px',
      data: { id: availableDate.id, name: `${availableDate.scheduledDate}: ${availableDate.startTime} - ${availableDate.endTime}`, type: 'horario' },
      autoFocus: false,
      restoreFocus: true,
      disableClose: true,
    });
    ref.afterClosed().subscribe((confirm: boolean) => {
      if (!confirm) return;
      this.availableDateService.delete(availableDate.id).subscribe({
        next: () => {
          this.toastr.success('Horario eliminado', 'Éxito');
          this.availableDates.set(this.availableDates().filter((ad) => ad.id !== availableDate.id));
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

      const availableDate: AvailableDate = {
        id: 0,
        advisorId: this.advisorId ?? 0,
        scheduledDate: result.scheduledDate ?? '',
        startTime: result.startTime ?? '',
        endTime: result.endTime ?? '',
        status: 'AVAILABLE',
      };

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
