import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Crop } from '../../../pages/apps/farmer/crops/crop';

@Component({
  selector: 'app-crop-table',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  templateUrl: './crop-table.component.html',
})
export class AppCropTableComponent implements OnChanges {
  @Input() data: Crop[] = [];
  @Input() filter: string = '';

  @Output() viewRequested = new EventEmitter<Crop>();
  @Output() editRequested = new EventEmitter<Crop>();
  @Output() deleteRequested = new EventEmitter<Crop>();

  displayedColumns: string[] = ['index', 'name', 'temperature', 'humidity', 'actions'];
  dataSource = new MatTableDataSource<Crop>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource.data = this.data ?? [];
      Promise.resolve().then(() => this.bindTableHelpers());
    }
    if (changes['filter']) {
      this.applyFilter(this.filter || '');
    }
  }

  private bindTableHelpers(): void {
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (row, term) => {
      const t = term.trim().toLowerCase();
      return (
        (row.name ?? '').toLowerCase().includes(t)
      );
    };
  }

  applyFilter(value: string) {
    this.dataSource.filter = (value || '').trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  getRowIndex(i: number): number {
    const pageIndex = this.dataSource.paginator?.pageIndex ?? 0;
    const pageSize = this.dataSource.paginator?.pageSize ?? this.dataSource.data.length;
    return pageIndex * pageSize + i + 1;
  }

  onView(row: Crop) { this.viewRequested.emit(row); }
  onEdit(row: Crop) { this.editRequested.emit(row); }
  onDelete(row: Crop) { this.deleteRequested.emit(row); }
}
