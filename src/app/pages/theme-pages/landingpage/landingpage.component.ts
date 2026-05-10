import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { ViewportScroller } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterLink } from '@angular/router';
import { BrandingComponent } from '../../../layouts/full/vertical/sidebar/branding.component';

interface profiles {
  id: number;
  name: string;
  subtext: string;
  imgSrc: string;
  description: string;
}

interface users {
  id: number;
  icon: string;
  title: string;
  subtext: string;
}

@Component({
  selector: 'app-landingpage',
  imports: [MaterialModule, TablerIconsModule, RouterLink, BrandingComponent],
  templateUrl: './landingpage.component.html',
})
export class AppLandingpageComponent {
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  options = this.settings.getOptions();

  constructor(
    private settings: CoreService,
    private scroller: ViewportScroller
  ) {}

  // scroll to demos
  gotoDemos() {
    this.scroller.scrollToAnchor('demos');
  }

  profiles: profiles[] = [
    {
      id: 1,
      imgSrc: '/assets/images/landingpage/profile/piero_perfil.jpg',
      name: 'Piero Delgado',
      subtext: 'Ingeniero de Software',
      description: 'Soy Piero, estudiante de octavo ciclo de Ingeniería de Software, con experiencia en diseño web empleando HTML y CSS, además del uso de Figma para elaborar prototipos. Me considero una persona responsable y organizada, comprometida con una gestión eficiente del tiempo.'
    },
    {
      id: 2,
      imgSrc: '/assets/images/landingpage/profile/luis_perfil.jpg',
      name: 'Luis Chinchihualpa',
      subtext: 'Ingeniero de Software',
      description: 'Soy Luis, estudiante del octavo ciclo de Ingeniería de Software en la UPC. Tengo experiencia en el desarrollo de aplicaciones web y móviles utilizando tecnologías como Java, Python, C++, Spring Boot, Angular y Vue. Me considero una persona responsable, adaptable y con interés en aprender continuamente nuevas tecnologías.'
    },
    {
      id: 3,
      imgSrc: '/assets/images/landingpage/profile/harold_perfil.png',
      name: 'Harold Elias',
      subtext: 'Ingeniero de Software',
      description: 'Soy Harold, estudiante de ingeniería de software en octavo ciclo, con interés en ciberseguridad y pentesting. Me caracterizo por mi capacidad de trabajo en equipo, aportando ideas y colaborando para lograr objetivos comunes.'
    },
    {
      id: 4,
      imgSrc: '/assets/images/landingpage/profile/sebastian_perfil.png',
      name: 'Sebastian Paredes',
      subtext: 'Ingeniero de Software',
      description: 'Soy Sebastian, estudiante del octavo ciclo de Ingeniería de Software. A lo largo de mi formación he adquirido experiencia trabajando con diversos lenguajes como C++, Python, C# y Java, aplicando principios de programación orientada a objetos.'
    },
    {
      id: 5,
      imgSrc: '/assets/images/landingpage/profile/salvador_perfil.jpg',
      name: 'Salvador Salinas',
      subtext: 'Ingeniero de Software',
      description: 'Soy Salvador y actualmente curso el octavo ciclo de la carrera de Ingeniería de Software. Poseo conocimientos en: programación orientada a objetos, desarrollo de backend, frontend web y móvil, y CI/CD. Considero que soy una persona responsable y organizado con los tiempos.'
    },
  ];

  users: users[] = [
    {
      id: 1,
      icon: 'building-cottage',
      title: 'Productores agrícolas',
      subtext:
        'Eres la fuerza detrás de la industria agrícola. Tu dedicación y pasión son la base de este negocio. Con AgroTech, obtendrás herramientas poderosas para gestionar tu granja de manera eficiente y maximizar tu producción.',
    },
    {
      id: 2,
      icon: 'user-circle',
      title: 'Asesores especializados',
      subtext:
        'Tienes el conocimiento y la experiencia necesarios para guiar a los granjeros hacia el éxito. Con AgroTech, podrás llegar a más personas y brindar asesoramiento personalizado. Tu contribución es vital para el crecimiento y la sostenibilidad de esta industria.',
    }
  ];

}
