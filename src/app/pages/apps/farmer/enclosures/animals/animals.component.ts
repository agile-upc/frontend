import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from 'src/app/material.module';
import { FarmerService } from 'src/app/services/apps/catalog/farmer.service';
import { AnimalService } from 'src/app/services/apps/enclosures/animal.service';
import { AppDeleteDialogComponent } from 'src/app/shared/components/delete-dialog/delete-dialog.component';
import { Animal } from 'src/app/shared/model/animal';

@Component({
  selector: 'app-animals',
  imports: [
    MaterialModule
  ],
  templateUrl: './animals.component.html',
  styleUrl: './animals.component.scss'
})
export class AppAnimalsComponent implements OnInit {
  animals = signal<Animal[]>([]);
  enclosureId: number | null = null;

  constructor(
    private animalService: AnimalService,
    private farmerService: FarmerService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.enclosureId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.enclosureId) {
      this.loadAnimalsData(this.enclosureId);
    }
  }

  loadAnimalsData(enclosureId: number): void {
    this.animalService.getAnimalsByEnclosure(enclosureId).subscribe(
      (animals) => {
        this.animals.set(animals);
      },
      (error) => {
        this.toastr.error('Failed to load animals');
      }
    );
  }

  create() {
    this.router.navigate([`/apps/farmer/enclosures/${this.enclosureId}/create-animal`]);
  }

  view(animal: Animal) {
    this.router.navigate([`/apps/farmer/enclosures/${this.enclosureId}/animals/${animal.id}`]);
  }

  edit(animal: Animal) {
    this.router.navigate([`/apps/farmer/enclosures/${this.enclosureId}/animals/${animal.id}/edit`]);
  }

  delete(animal: Animal) {
    const ref = this.dialog.open(AppDeleteDialogComponent, {
      width: '420px',
      data: { id: animal.id, name: animal.name, type: "animal" },
      autoFocus: false,
      restoreFocus: true,
      disableClose: true,
    });
    ref.afterClosed().subscribe((confirm: boolean) => {
      if (!confirm) return;
      this.animalService.deleteAnimal(animal.id).subscribe({
        next: () => {
          this.toastr.success('Animal eliminado', 'Éxito');
          this.animals.set(this.animals().filter(a => a.id !== animal.id));
        },
        error: (err) => {
          console.error('No se pudo eliminar el animal:', err);
          this.toastr.error('No se pudo eliminar el animal', 'Error');
        }
      });
    });
  }

  goBack() {
    this.router.navigate(['/apps/farmer/enclosures']);
  }

}
