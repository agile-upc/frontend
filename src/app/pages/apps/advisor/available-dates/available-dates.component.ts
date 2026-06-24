import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { AvailableDateCreateDialogComponent } from 'src/app/components/available-dates/create-dialog/available-date-create-dialog.component';
import { AppDeleteDialogComponent } from 'src/app/shared/components/delete-dialog/delete-dialog.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AvailableDate } from 'src/app/shared/model/available-date';
import { AvailableDateService } from 'src/app/services/apps/appointment/available-date.service';
import { TimeFormatPipe } from 'src/app/pipes/filter.pipe';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalizedDatePipe } from 'src/app/pipes/localized-date.pipe';

@Component({
  selector: 'app-available-dates',
  imports: [CommonModule, MaterialModule, TablerIconsModule, TimeFormatPipe, LocalizedDatePipe, TranslateModule],
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
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.advisorId = this.authService.user.advisorId;
    this.loadAvailableDates();
  }

  private loadAvailableDates(): void {
    this.availableDateService.findByAdvisorId(this.advisorId ?? undefined).subscribe({
      next: (data) =>
        this.availableDates.set(
          data.filter((availableDate) => availableDate.status?.toUpperCase() !== 'UNAVAILABLE')
        ),
      error: (err) => console.error('Error fetching available dates:', err)
    });
  }

  orderedAvailableDates(): AvailableDate[] {
    return [...this.availableDates()].sort((a, b) => {
      const dateDiff = a.scheduledDate.localeCompare(b.scheduledDate);
      return dateDiff || a.startTime.localeCompare(b.startTime);
    });
  }

  parseDate(value: string): Date {
    const [year, month, day] = value.split('-').map((part) => Number(part));
    return new Date(year, month - 1, day);
  }

  openDeleteDialog(availableDate: AvailableDate): void {
    const ref = this.dialog.open(AppDeleteDialogComponent, {
      width: '420px',
      data: { id: availableDate.id, name: `${availableDate.scheduledDate}: ${availableDate.startTime} - ${availableDate.endTime}`, type: this.translate.instant('availability.schedule') },
      autoFocus: false,
      restoreFocus: true,
      disableClose: true,
    });
    ref.afterClosed().subscribe((confirm: boolean) => {
      if (!confirm) return;
      this.availableDateService.delete(availableDate.id).subscribe({
        next: () => {
          this.toastr.success(this.translate.instant('availability.success.deleted'), this.translate.instant('common.success'));
          this.availableDates.set(this.availableDates().filter((ad) => ad.id !== availableDate.id));
        },
        error: (err) => {
          console.error('No se pudo eliminar el horario:', err);
          this.toastr.error(this.translate.instant('availability.error.delete'), this.translate.instant('common.error'));
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
          this.toastr.success(this.translate.instant('availability.success.created'), this.translate.instant('common.success'));
        },
        error: (err) => {
          console.error('No se pudo agregar el horario:', err);
          this.toastr.error(this.translate.instant('availability.error.create'), this.translate.instant('common.error'));
        }
      });
    });
  }
}
