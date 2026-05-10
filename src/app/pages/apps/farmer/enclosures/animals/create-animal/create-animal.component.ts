import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { AnimalService } from 'src/app/services/apps/enclosures/animal.service';
import { Animal } from 'src/app/shared/model/animal';
import { A11yModule } from "@angular/cdk/a11y";
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-animal',
  imports: [
    MaterialModule,
    CommonModule,
    A11yModule
],
  templateUrl: './create-animal.component.html'
})
export class AppCreateAnimalComponent {
  enclosureId: number = 0;
  animalForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private animalService: AnimalService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.enclosureId = this.route.snapshot.params['id'];
    this.animalForm = this.fb.group({
      name: ['', Validators.required],
      species: ['', Validators.required],
      breed: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      gender: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(0.1)]],
      health: ['', Validators.required]
    });
  }

  create() {
    if (this.animalForm.valid) {
      const animal: Animal = {
        id: 0,
        enclosureId: this.enclosureId,
        name: this.animalForm.value.name,
        species: this.animalForm.value.species,
        breed: this.animalForm.value.breed,
        age: parseFloat(this.animalForm.value.age),
        gender: (this.animalForm.value.gender === 'true'),
        weight: this.animalForm.value.weight,
        health: this.animalForm.value.health
      }

      this.animalService.createAnimal(animal).subscribe({
        next: () => {
          this.router.navigate(['/apps/farmer/enclosures', this.enclosureId, 'animals']);
          this.toastr.success('Animal creado');
        },
        error: (err) => {
          console.error('Error creating animal:', err);
          this.toastr.error('Error al crear el animal');
        }
      })

    }
  }

  goBack() {
    this.router.navigate(['/apps/farmer/enclosures', this.enclosureId, 'animals']);
  }
}
