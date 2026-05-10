import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import {DecimalPipe, NgIf, NgStyle} from "@angular/common";
import { MatDialog } from '@angular/material/dialog';
import {Crop} from "../crop";
import {CropService} from "src/app/services/apps/crops/crop.service";
import {HumidityChartComponent} from "src/app/components/crops/humidity-chart/humidity-chart.component";
import {TemperatureChartComponent} from "src/app/components/crops/temperature-chart/temperature-chart.component";
import {finalize} from "rxjs";

@Component({
  selector: 'app-crop-detail-page',
  imports: [MaterialModule, TablerIconsModule, NgIf, HumidityChartComponent, NgStyle, TemperatureChartComponent, DecimalPipe],
  templateUrl: './crop-detail.component.html'
})
export class AppCropDetailComponent implements OnInit {
  crop: Crop;
  isLoading: boolean = false;

  constructor(public router: Router,
              public activatedRoute: ActivatedRoute,
              public cropService: CropService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const cropId = params['cropId'];
      if (cropId) {
        this.loadCrop(cropId);
      }
    });
  }

  private loadCrop(cropId: number): void {
    this.isLoading = true;
    this.cropService.getCropById(cropId).pipe(
      finalize(() => { this.isLoading = false; })
    ).subscribe({
      next: (data) => {
        this.crop = data;
      },
      error: (err) => {
        console.error('Error cargando Crop:', err);
      },
    });
  }
}
