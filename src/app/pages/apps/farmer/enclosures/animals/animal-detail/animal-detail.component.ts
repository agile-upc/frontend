import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from 'src/app/material.module';
import { AnimalService } from 'src/app/services/apps/enclosures/animal.service';
import { AppDeleteDialogComponent } from 'src/app/shared/components/delete-dialog/delete-dialog.component';
import { Animal } from 'src/app/shared/model/animal';

@Component({
  selector: 'app-animal-detail',
  imports: [
    MaterialModule
  ],
  templateUrl: './animal-detail.component.html',
  styleUrl: './animal-detail.component.scss'
})
export class AppAnimalDetailComponent implements OnInit {
  animal: Animal | null = null;
  enclosureId: number | null = null;
  animalHealthStatus: string = "";

  constructor(
    private animalService: AnimalService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.enclosureId = Number(this.route.snapshot.paramMap.get('id'));
    const animalId = Number(this.route.snapshot.paramMap.get('animalId'));
    this.loadAnimalDetails(animalId);
  }

  loadAnimalDetails(animalId: number): void {
    if (animalId) {
      this.animalService.getAnimalById(animalId).subscribe(
        (animal) => {
          this.animal = animal;
          switch (animal.health) {
            case 'HEALTHY':
              this.animalHealthStatus = 'Saludable';
              break;
            case 'SICK':
              this.animalHealthStatus = 'Enfermo';
              break;
            case 'DEAD':
              this.animalHealthStatus = 'Fallecido';
              break;
            default:
              this.animalHealthStatus = 'Desconocido';
              break;
          }
        },
        (error) => {
          console.error('Failed to load animal details', error);
        }
      );
    }
  }

  edit() {
    this.router.navigate([`/apps/farmer/enclosures/${this.enclosureId}/animals/${this.animal?.id}/edit`]);
  }

  delete() {
    const ref = this.dialog.open(AppDeleteDialogComponent, {
      width: '420px',
      data: { id: this.animal?.id, name: this.animal?.name, type: "animal" },
      autoFocus: false,
      restoreFocus: true,
      disableClose: true,
    });
    ref.afterClosed().subscribe((confirm: boolean) => {
      if (!confirm) return;
      const animalId = this.animal?.id;
      if (!animalId) return;
      this.animalService.deleteAnimal(animalId).subscribe({
        next: () => {
          this.toastr.success('Animal eliminado', 'Éxito');
          this.router.navigate([`/apps/farmer/enclosures/${this.enclosureId}/animals`]);
        },
        error: (error) => {
          console.error('No se pudo eliminar el animal:', error);
          this.toastr.error('No se pudo eliminar el animal', 'Error');
        }
      });
    });
  }

  goBack() {
    this.router.navigate([`/apps/farmer/enclosures/${this.enclosureId}/animals`]);
  }

}
