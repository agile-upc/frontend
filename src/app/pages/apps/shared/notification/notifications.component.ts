import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { UserNotification } from 'src/app/shared/model/userNotification';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalizedDatePipe } from 'src/app/pipes/localized-date.pipe';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule, TranslateModule, LocalizedDatePipe],
})
export class AppNotificationsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'message', 'sendAt', 'actions'];
  dataSource = new MatTableDataSource<UserNotification>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private notificationService: NotificationService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.fetchNotifications().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => this.toastr.error(this.translate.instant('notifications.error.load')),
    });
  }

  getRowIndex(i: number): number {
    return i + 1;
  }

  onDelete(row: UserNotification): void {
    this.notificationService.deleteNotification(row.id).subscribe({
      next: () => {
        this.toastr.success(this.translate.instant('notifications.success.deleted'));
        this.loadNotifications();
      },
      error: () => this.toastr.error(this.translate.instant('notifications.error.delete')),
    });
  }
}
