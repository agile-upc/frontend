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

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
})
export class AppNotificationsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'message', 'sendAt', 'actions'];
  dataSource = new MatTableDataSource<UserNotification>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private notificationService: NotificationService,
    private toastr: ToastrService
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
      error: () => this.toastr.error('Error al cargar notificaciones'),
    });
  }

  getRowIndex(i: number): number {
    return i + 1;
  }

  onDelete(row: UserNotification): void {
    this.notificationService.deleteNotification(row.id).subscribe({
      next: () => {
        this.toastr.success('Notificación eliminada');
        this.loadNotifications();
      },
      error: () => this.toastr.error('Error al eliminar notificación'),
    });
  }
}
