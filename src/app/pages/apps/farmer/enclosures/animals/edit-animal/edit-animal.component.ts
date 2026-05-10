import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from 'src/app/material.module';
import { AnimalService } from 'src/app/services/apps/enclosures/animal.service';
import { Animal } from 'src/app/shared/model/animal';

@Component({
  selector: 'app-edit-animal',
  imports: [
    MaterialModule,
    CommonModule
  ],
  templateUrl: './edit-animal.component.html'
})
export class AppEditAnimalComponent implements OnInit {
  enclosureId: number = 0;
  animalId: number = 0;
  animalForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private animalService: AnimalService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    // Initialize an empty form so the template can bind safely before the HTTP response arrives
    this.animalForm = this.fb.group({
      name: [''],
      species: [''],
      breed: [''],
      age: [null],
      gender: ['true'],
      weight: [null],
      health: ['UNKNOWN']
    });
  }

  ngOnInit() {
    this.animalId = this.route.snapshot.params['animalId'];
    this.enclosureId = this.route.snapshot.params['id'];
    this.loadAnimal();
  }

  loadAnimal() {
    this.animalService.getAnimalById(this.animalId).subscribe({
      next: (animal) => {
        this.animalForm.patchValue({
          name: animal.name,
          species: animal.species,
          breed: animal.breed,
          age: animal.age,
          gender: animal.gender ? 'true' : 'false',
          weight: animal.weight,
          health: animal.health
        });
        this.animalForm.get('name')?.setValidators(Validators.required);
        this.animalForm.get('species')?.setValidators(Validators.required);
        this.animalForm.get('breed')?.setValidators(Validators.required);
        this.animalForm.get('age')?.setValidators([Validators.required, Validators.min(0)]);
        this.animalForm.get('gender')?.setValidators(Validators.required);
        this.animalForm.get('weight')?.setValidators([Validators.required, Validators.min(0.1)]);
        this.animalForm.get('health')?.setValidators(Validators.required);
        this.animalForm.updateValueAndValidity();
      },
      error: (err) => {
        console.error('Error loading animal:', err);
      }
    });
  }

  update() {
    if (this.animalForm.valid) {
      const animal: Animal = {
        id: this.animalId,
        enclosureId: this.animalForm.value.enclosureId,
        name: this.animalForm.value.name,
        species: this.animalForm.value.species,
        breed: this.animalForm.value.breed,
        age: parseFloat(this.animalForm.value.age),
        gender: (this.animalForm.value.gender === 'true'),
        weight: this.animalForm.value.weight,
        health: this.animalForm.value.health
      }
      this.animalService.updateAnimal(this.animalId, animal).subscribe({
        next: () => {
          this.toastr.success('Animal actualizado');
          this.router.navigate(['/apps/farmer/enclosures', this.enclosureId, 'animals']);
        },
        error: (err) => {
          console.error('Error updating animal:', err);
          this.toastr.error('Error al actualizar el animal');
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/apps/farmer/enclosures', this.enclosureId, 'animals']);
  }

}
