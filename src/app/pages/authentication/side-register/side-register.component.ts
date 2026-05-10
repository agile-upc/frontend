import {Component, OnInit} from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import {AuthService} from "../../../shared/services/auth.service";
import {User} from "../../../shared/model/user";
import {ToastrService} from "ngx-toastr";
import {BrandingComponent} from "../../../layouts/full/vertical/sidebar/branding.component";
import {NgIf} from "@angular/common";
import {TablerIconsModule} from "angular-tabler-icons";
import {ProfileService} from "../../../shared/services/profile.service";
import {Profile} from "../../../shared/model/profile";

@Component({
    selector: 'app-side-register',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, BrandingComponent, NgIf, TablerIconsModule],
    templateUrl: './side-register.component.html',
    styleUrls: ['./side-register.component.scss']
})
export class AppSideRegisterComponent implements OnInit{
  options = this.settings.getOptions();
  user: User = new User(null,'', '', null);
  image: any = null;
  imageUrl: string = '';
  imageName: string = '';

  today = new Date();
  maxBirthDate = new Date(
    this.today.getFullYear() - 18,
    this.today.getMonth(),
    this.today.getDate()
  );


  constructor(private settings: CoreService,
              private authService: AuthService,
              private profileService: ProfileService,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.form.get('role')?.valueChanges.subscribe(() => {
      this.updateRequirement()
    })
    this.updateRequirement()
  }

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    role: new FormControl('ROLE_FARMER', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    birthDate: new FormControl(null, [Validators.required]),
    description: new FormControl('', []),
    occupation: new FormControl('', []),
    experience: new FormControl(null, []),
    photo: new FormControl('', [Validators.required]),
  });

  updateRequirement() {
    if (this.form.get('role')?.value === 'ROLE_ADVISOR') {
      this.form.get('description')?.setValidators([Validators.required]);
      this.form.get('occupation')?.setValidators([Validators.required]);
      this.form.get('experience')?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      this.form.get('description')?.clearValidators();
      this.form.get('occupation')?.clearValidators();
      this.form.get('experience')?.clearValidators();
    }
    this.form.get('description')?.updateValueAndValidity();
    this.form.get('occupation')?.updateValueAndValidity();
    this.form.get('experience')?.updateValueAndValidity();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.image = file;
      this.imageName = file.name;
      this.imageUrl = URL.createObjectURL(file);
      this.form.get('photo')?.setValue(this.imageName);
    }
  }

  isAdvisor() {
    return this.form.get('role')?.value === 'ROLE_ADVISOR';
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) { return }
    const roles = ['ROLE_USER', this.form.value.role!];
    this.user = new User(null, this.form.value.uname!, this.form.value.password!, roles);
    this.authService.signup(this.user).subscribe(response => {
      this.authService.login(this.user).subscribe(res => {
        this.authService.saveUser(res.id, res.token);
        this.authService.saveToken(res.token);
        // profile creation
        let profile = new Profile(
          0,
          response.id,
          this.form.value.firstName!,
          this.form.value.lastName!,
          this.form.value.city!,
          this.form.value.country!,
          this.form.value.birthDate!,
          this.form.value.description!,
          this.form.value.photo!,
          this.isAdvisor() ? this.form.value.occupation! : "",
          this.isAdvisor() ? this.form.value.experience! : 0
        )
        this.profileService.create(profile, this.image).subscribe(res => {
          this.toastr.success('Usuario registrado con éxito', 'Registro exitoso');
        })
        this.router.navigate(['']);
      });
    },
      _error => {
        this.toastr.error('Error al registrar el usuario', 'Error de registro');
      })
  }
}
