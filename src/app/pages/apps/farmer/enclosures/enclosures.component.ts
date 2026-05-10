import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FarmerService } from 'src/app/services/apps/catalog/farmer.service';
import { EnclosureService } from 'src/app/services/apps/enclosures/enclosure.service';
import { Enclosure } from 'src/app/shared/model/enclosure';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AppEnclosureEditDialogComponent } from "src/app/components/enclosures/edit-dialog/enclosure-edit-dialog.component";
import { AppEnclosureCreateDialogComponent } from "src/app/components/enclosures/create-dialog/enclosure-create-dialog.component";
import { AppEnclosureInfoDialogComponent } from "src/app/components/enclosures/info-dialog/enclosure-info-dialog.component";
import { Farmer } from "src/app/components/catalog/review/farmer";
import { AppEnclosuresTableComponent } from "src/app/components/enclosures/table/enclosures-table.component";
import {AppDeleteDialogComponent} from "src/app/shared/components/delete-dialog/delete-dialog.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-enclosures',
  templateUrl: './enclosures.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, TablerIconsModule, AppEnclosuresTableComponent],
  standalone: true,
})
export class AppEnclosuresComponent implements OnInit {
  searchText = signal<string>('');
  enclosures = signal<Enclosure[]>([]);
  filteredEnclosures = computed<Enclosure[]>(() => {
    const term = (this.searchText() || '').trim().toLowerCase();
    if (!term) return [];
    return this.enclosures().filter(e => (e.name || '').toLowerCase().includes(term)).slice(0, 8);
  });

  displayEnclosure = (enc?: Enclosure): string => enc?.name ?? '';

  // Identity
  userId: number | null = null;
  farmerId: number | null = null;

  constructor(
    private authService: AuthService,
    private farmerService: FarmerService,
    private enclosureService: EnclosureService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener userId guardado al iniciar sesión
    this.userId = this.authService.user.id;

    if (this.userId != null) {
      // Resolver farmerId a partir del userId
      this.farmerService.getFarmerByUserId(this.userId).subscribe({
        next: (farmer: Farmer) => {
          // La entidad Farmer tiene "farmerId"
          // Nota: si el backend cambia el nombre, ajustar aquí
          this.farmerId = farmer.farmerId ?? null;
          if (this.farmerId != null) {
            this.loadEnclosures(this.farmerId);
          }
        },
        error: (err) => {
          console.error('No se pudo obtener el farmerId del usuario actual:', err);
        }
      });
    }
  }

  private loadEnclosures(farmerId: number): void {
    this.enclosureService.getEnclosuresByFarmer(farmerId).subscribe({
      next: (data) => this.enclosures.set(data ?? []),
      error: (err) => console.error('Error cargando recintos:', err),
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchText.set(filterValue);
    // La lógica de filtrado se aplicará sobre la tabla próximamente.
  }

  onSelectSuggestion(event: MatAutocompleteSelectedEvent): void {
    const enc: Enclosure = event.option?.value as Enclosure;
    if (!enc) return;
    this.dialog.open(AppEnclosureInfoDialogComponent, {
      width: '420px',
      data: { name: enc.name, capacity: enc.capacity, type: enc.type },
      autoFocus: false,
      restoreFocus: true,
    });
  }

  onAddEnclosure(): void {
    const ref = this.dialog.open(AppEnclosureCreateDialogComponent, {
      width: '480px',
      autoFocus: true,
      restoreFocus: true,
      disableClose: true,
    });
    ref.afterClosed().subscribe((result?: Partial<Enclosure>) => {
      if (!result) return;
      if (this.farmerId == null) {
        this.toastr.error('No se pudo determinar el farmerId', 'Error');
        return;
      }
      const payload = {
        name: result.name?.trim() ?? '',
        capacity: Number(result.capacity ?? 0),
        type: result.type?.trim() ?? '',
        farmerId: this.farmerId,
      } as Omit<Enclosure, 'id'>;

      this.enclosureService.createEnclosure(payload).subscribe({
        next: (created) => {
          this.enclosures.set([created, ...this.enclosures()]);
          this.toastr.success('Recinto creado', 'Éxito');
        },
        error: (err) => {
          console.error('No se pudo crear el recinto:', err);
          this.toastr.error('No se pudo crear el recinto', 'Error');
        }
      });
    });
  }

  onView(row: Enclosure): void {
    // ir a ruta /apps/farmer/enclosures/:id/animals
    // usando routerLink o programáticamente
    // Aquí se hace programáticamente
    const enclosureId = row.id;
    if (enclosureId == null) return;
    this.router.navigate(['/apps/farmer/enclosures', enclosureId, 'animals']);
  }

  onEdit(row: Enclosure): void {
    const ref = this.dialog.open(AppEnclosureEditDialogComponent, {
      width: '480px',
      data: { ...row },
      autoFocus: true,
      restoreFocus: true,
      disableClose: true,
    });
    ref.afterClosed().subscribe((result?: Partial<Enclosure>) => {
      if (!result) return;
      const payload: Enclosure = {
        id: row.id,
        name: result.name ?? row.name,
        capacity: result.capacity ?? row.capacity,
        type: result.type ?? row.type,
        farmerId: row.farmerId,
      };
      this.enclosureService.updateEnclosure(row.id, payload).subscribe({
        next: (updated) => {
          // actualizar en memoria sin volver a cargar toda la lista
          const nextData = this.enclosures().map(e => e.id === updated.id ? updated : e);
          this.enclosures.set(nextData);
        },
        error: (err) => console.error('No se pudo actualizar el recinto:', err)
      });
    });
  }

  onDelete(row: Enclosure): void {
    const ref = this.dialog.open(AppDeleteDialogComponent, {
      width: '420px',
      data: { id: row.id, name: row.name, type: "recinto" },
      autoFocus: false,
      restoreFocus: true,
      disableClose: true,
    });
    ref.afterClosed().subscribe((confirm: boolean) => {
      if (!confirm) return;
      this.enclosureService.deleteEnclosure(row.id).subscribe({
        next: () => {
          this.enclosures.set(this.enclosures().filter(e => e.id !== row.id));
          this.toastr.success('Recinto eliminado', 'Éxito');
        },
        error: (err) => {
          console.error('No se pudo eliminar el recinto:', err);
          this.toastr.error('No se pudo eliminar el recinto', 'Error');
        }
      });
    });
  }
}
