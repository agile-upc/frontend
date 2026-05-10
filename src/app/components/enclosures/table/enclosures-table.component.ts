import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Enclosure } from 'src/app/shared/model/enclosure';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-enclosures-table',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  templateUrl: './enclosure-table.component.html',
})
export class AppEnclosuresTableComponent implements OnChanges {
  @Input() data: Enclosure[] = [];
  @Input() filter: string = '';

  @Output() viewRequested = new EventEmitter<Enclosure>();
  @Output() editRequested = new EventEmitter<Enclosure>();
  @Output() deleteRequested = new EventEmitter<Enclosure>();

  displayedColumns: string[] = ['index', 'name', 'capacity', 'type', 'actions'];
  dataSource = new MatTableDataSource<Enclosure>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource.data = this.data ?? [];
      // rebind paginator/sort if available
      Promise.resolve().then(() => this.bindTableHelpers());
    }
    if (changes['filter']) {
      this.applyFilter(this.filter || '');
    }
  }

  private bindTableHelpers(): void {
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
    // custom filter: name or type contains text
    this.dataSource.filterPredicate = (row, term) => {
      const t = term.trim().toLowerCase();
      return (
        (row.name ?? '').toLowerCase().includes(t) ||
        (row.type ?? '').toLowerCase().includes(t)
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

  onView(row: Enclosure) { this.viewRequested.emit(row); }
  onEdit(row: Enclosure) { this.editRequested.emit(row); }
  onDelete(row: Enclosure) { this.deleteRequested.emit(row); }
}

