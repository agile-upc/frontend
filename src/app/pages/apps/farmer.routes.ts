import { Routes } from '@angular/router';

import { AppPostsComponent } from './farmer/posts/posts.component';
import {AppCatalogComponent} from "./farmer/catalog/catalog.component";
import {AppAdvisorDetailComponent} from "./farmer/catalog/advisor-detail/advisor-detail.component";
import {AppBookAppointmentComponent} from "./farmer/catalog/book-appointment/book-appointment.component";
import { AppEnclosuresComponent } from './farmer/enclosures/enclosures.component';
import {AppAppointmentsComponent} from "./farmer/appointment/appointments.component";
import {AppAppointmentsHistoryComponent} from "./farmer/appointment/history/appointments-history.component";
import {AppointmentDetailComponent} from "./farmer/appointment/detail/appointment-detail.component";
import { AppAnimalsComponent } from './farmer/enclosures/animals/animals.component';
import { AppAnimalDetailComponent } from './farmer/enclosures/animals/animal-detail/animal-detail.component';
import { AppCreateAnimalComponent } from './farmer/enclosures/animals/create-animal/create-animal.component';
import { AppEditAnimalComponent } from './farmer/enclosures/animals/edit-animal/edit-animal.component';
import {AppCropsComponent} from "./farmer/crops/crops.component";
import {AppCropDetailComponent} from "./farmer/crops/crop-detail/crop-detail.component";


export const FarmerRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'catalog',
        component: AppCatalogComponent,
        data: {
          title: 'Catálogo de asesores',
          urls: [
            { title: 'Catalog', url: '/apps/farmer/catalog' },
          ],
        },
      },
      {
        path: 'catalog/:advisorId',
        component: AppAdvisorDetailComponent,
        data: {
          title: 'Detalle del asesor',
          urls: [
            { title: 'Catalog', url: '/apps/farmer/catalog' },
            { title: 'Advisor Detail' },
          ]
        }
      },
      {
        path: 'catalog/:advisorId/book',
        component: AppBookAppointmentComponent,
        data: {
          title: 'Reservar cita',
          urls: [
            { title: 'Catalog', url: '/apps/farmer/catalog' },
            { title: 'Book Appointment' },
          ]
        }
      },
      {
        path: 'appointments',
        component: AppAppointmentsComponent,
        data: {
          title: 'Mis citas',
          urls: [
            { title: 'Appointments', url: '/apps/farmer/appointments' },
          ],
        }
      },
      {
        path: 'appointments/history',
        component: AppAppointmentsHistoryComponent,
        data: {
          title: 'Historial de citas',
          urls: [
            { title: 'Appointments', url: '/apps/farmer/appointments' },
            { title: 'Appointment History' },
          ],
        }
      },
      {
        path: 'appointments/:id',
        component: AppointmentDetailComponent,
        data: {
          title: 'Detalle de la cita',
          urls: [
            { title: 'Appointments', url: '/apps/farmer/appointments' },
            { title: 'Appointment Detail' },
          ],
        }
      },
      {
        path: 'enclosures',
        component: AppEnclosuresComponent,
        data: {
          title: 'Mis recintos',
          urls: [
            { title: 'Enclosures', url: '/apps/farmer/enclosures' },
          ],
        },
      },
      {
        path: 'enclosures/:id/animals',
        component: AppAnimalsComponent,
        data: {
          title: 'Animales del recinto',
          urls: [
            { title: 'Enclosures', url: '/apps/farmer/enclosures' },
            { title: 'Animals' },
          ],
        },
      },
      {
        path: 'enclosures/:id/animals/:animalId',
        component: AppAnimalDetailComponent,
        data: {
          title: 'Detalle del animal',
          urls: [
            { title: 'Enclosures', url: '/apps/farmer/enclosures' },
            { title: 'Animal Detail' },
          ],
        },
      },
      {
        path: 'enclosures/:id/create-animal',
        component: AppCreateAnimalComponent,
        data: {
          title: 'Crear animal',
          urls: [
            { title: 'Enclosures', url: '/apps/farmer/enclosures' },
            { title: 'Create Animal' },
          ],
        },
      },
      {
        path: 'enclosures/:id/animals/:animalId/edit',
        component: AppEditAnimalComponent,
        data: {
          title: 'Editar animal',
          urls: [
            { title: 'Enclosures', url: '/apps/farmer/enclosures' },
            { title: 'Edit Animal' },
          ],
        },
      },
      {
        path: 'crops',
        component: AppCropsComponent,
        data: {
          title: 'Mis cultivos',
          urls: [
            { title: 'Crops', url: '/apps/farmer/crops' },
          ],
        },
      },
      {
        path: 'crops/:cropId',
        component: AppCropDetailComponent,
        data: {
          title: 'Detalle del cultivo',
          urls: [
            { title: 'Crops', url: '/apps/farmer/crops' },
            { title: 'Crop Detail' },
          ]
        }
      },
      {
        path: 'posts',
        component: AppPostsComponent,
        data: {
          title: 'Publicaciones de asesores',
          urls: [
            { title: 'Posts', url: '/apps/farmer/posts' },
          ]
        }
      }
    ],
  },
];
