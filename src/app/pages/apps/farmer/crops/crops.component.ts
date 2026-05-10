import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FarmerService } from 'src/app/services/apps/catalog/farmer.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Farmer } from "src/app/components/catalog/review/farmer";
import {AppDeleteDialogComponent} from "src/app/shared/components/delete-dialog/delete-dialog.component";
import { Router } from '@angular/router';
import {CropService} from "../../../../services/apps/crops/crop.service";
import {Crop} from "./crop";
import {AppCropTableComponent} from "../../../../components/crops/table/crop-table.component";
import {AppCropCreateDialogComponent} from "../../../../components/crops/create-dialog/crop-create-dialog.component";
import {AppCropEditDialogComponent} from "../../../../components/crops/edit-dialog/crop-edit-dialog.component";
import {CropDto} from "./cropDto";

@Component({
  selector: 'app-crops',
  templateUrl: './crops.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, TablerIconsModule, AppCropTableComponent],
  standalone: true,
})
export class AppCropsComponent implements OnInit {
  crops = signal<Crop[]>([]);
  // Identity
  userId: number | null = null;
  farmerId: number | null = null;

  constructor(
    private authService: AuthService,
    private farmerService: FarmerService,
    private cropService: CropService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.user.id;

    if (this.userId != null) {
      this.farmerService.getFarmerByUserId(this.userId).subscribe({
        next: (farmer: Farmer) => {
          this.farmerId = farmer.farmerId ?? null;
          if (this.farmerId != null) {
            this.loadCrops(this.farmerId);
          }
        },
        error: (err) => console.error('No se pudo obtener farmerId:', err)
      });
    }
  }

  private loadCrops(farmerId: number): void {
    this.cropService.getCropsByFarmer(farmerId).subscribe({
      next: (data) => this.crops.set(data ?? []),
      error: (err) => console.error('Error cargando cultivos:', err),
    });
  }

  onAddCrop(): void {
    const ref = this.dialog.open(AppCropCreateDialogComponent, {
      width: '480px',
      autoFocus: true,
      restoreFocus: true,
      disableClose: true,
    });

    ref.afterClosed().subscribe((result?: CropDto) => {
      if (!result) return;

      const payload = {
        name: result.name?.trim() ?? '',
        farmerId: this.farmerId ?? 0,
        temperature: Number(result.temperature ?? 0),
        humidity: Number(result.humidity ?? 0),
        tankMaxVolume: Number(result.tankMaxVolume ?? 0),
        tankHeight: Number(result.tankHeight ?? 0),
        tankCurrentVolume: Number(result.tankCurrentVolume ?? 0),
        temperatureMaxThreshold: Number(result.temperatureMaxThreshold ?? 0),
        humidityMinThreshold: Number(result.humidityMinThreshold ?? 0),
      };

      this.cropService.createCrop(payload).subscribe({
        next: (createdDto) => {
          const created = Crop.fromDto(createdDto);
          this.crops.set([created, ...this.crops()]);
          this.toastr.success('Cultivo creado', 'Éxito');
        },
        error: (err) => {
          console.error('No se pudo crear el cultivo:', err);
          this.toastr.error('No se pudo crear el cultivo', 'Error');
        }
      });
    });
  }

  onView(row: Crop): void {
    if (!row.id) return;
    this.router.navigate(['/apps/farmer/crops', row.id]);
  }

  onEdit(row: Crop): void {
    const ref = this.dialog.open(AppCropEditDialogComponent, {
      width: '480px',
      data: { ...row },
      autoFocus: true,
      restoreFocus: true,
      disableClose: true,
    });

    ref.afterClosed().subscribe((result?: CropDto) => {
      if (!result) return;

      const payload: CropDto = {
        name: result.name ?? row.name,
        farmerId: row.farmerId,
        temperature: result.temperature ?? row.temperature,
        humidity: result.humidity ?? row.humidity,
        tankMaxVolume: result.tankMaxVolume ?? row.tankMaxVolume,
        tankHeight: result.tankHeight ?? row.tankHeight,
        tankCurrentVolume: result.tankCurrentVolume ?? row.tankCurrentVolume,
        temperatureMaxThreshold: result.temperatureMaxThreshold ?? row.temperatureMaxThreshold,
        humidityMinThreshold: result.humidityMinThreshold ?? row.humidityMinThreshold,
      };

      this.cropService.updateCrop(row.id, payload).subscribe({
        next: (updatedDto) => {
          const updated = Crop.fromDto(updatedDto);
          const nextData = this.crops().map(e => e.id === updated.id ? updated : e);
          this.crops.set(nextData);
        },
        error: (err) => console.error('No se pudo actualizar el cultivo:', err)
      });
    });
  }

  onDelete(row: Crop): void {
    const ref = this.dialog.open(AppDeleteDialogComponent, {
      width: '420px',
      data: { id: row.id, name: row.name, type: "cultivo" },
      autoFocus: false,
      restoreFocus: true,
      disableClose: true,
    });

    ref.afterClosed().subscribe((confirm: boolean) => {
      if (!confirm) return;

      this.cropService.deleteCrop(row.id).subscribe({
        next: () => {
          this.crops.set(this.crops().filter(e => e.id !== row.id));
          this.toastr.success('Cultivo eliminado', 'Éxito');
        },
        error: (err) => {
          console.error('No se pudo eliminar el cultivo:', err);
          this.toastr.error('No se pudo eliminar el cultivo', 'Error');
        }
      });
    });
  }
}
