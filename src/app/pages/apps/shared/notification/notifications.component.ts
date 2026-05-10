import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { UserNotification } from 'src/app/shared/model/userNotification';
import {AuthService} from "../../../../shared/services/auth.service";

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

  userId: number | null;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.user.id;
    if (this.userId != null) {
      this.loadNotifications(this.userId);
    }
  }

  loadNotifications(userId: number): void {
    this.notificationService.fetchNotificationsByUserId(userId).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.dataSource);
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
        if (this.userId != null) this.loadNotifications(this.userId);
      },
      error: () => this.toastr.error('Error al eliminar notificación'),
    });
  }
}
