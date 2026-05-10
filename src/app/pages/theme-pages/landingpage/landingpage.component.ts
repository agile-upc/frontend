import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CoreService } from 'src/app/services/core.service';
import { MaterialModule } from 'src/app/material.module';
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

  gotoDemos() {
    this.scroller.scrollToAnchor('demos');
  }

  profiles: profiles[] = [
    {
      id: 1,
      imgSrc: '/assets/images/landingpage/profile/piero_perfil.jpg',
      name: 'Piero Delgado',
      subtext: 'Ingeniero de Software',
      description: 'Soy Piero, estudiante de noveno ciclo de Ingeniería de Software, con experiencia en diseño web empleando HTML y CSS, además del uso de Figma para elaborar prototipos. Me considero una persona responsable y organizada, comprometida con una gestión eficiente del tiempo.'
    },
    {
      id: 2,
      imgSrc: '/assets/images/landingpage/profile/ariana_perfil.png',
      name: 'Ariana Vargas',
      subtext: 'Ingeniero de Software',
      description: 'Soy Ariana, estudiante del noveno ciclo de Ingeniería de Software. Me interesa construir productos web bien diseñados y funcionales, colaborando de forma organizada y manteniendo una fuerte atención al detalle.'
    },
    {
      id: 3,
      imgSrc: '/assets/images/landingpage/profile/mauricio_perfil.png',
      name: 'Mauricio Salas',
      subtext: 'Ingeniero de Software',
      description: 'Soy Mauricio, estudiante del noveno ciclo de Ingeniería de Software. Disfruto trabajar en soluciones web y backend, con enfoque en implementar funcionalidades claras, mantenibles y alineadas con las necesidades del usuario.'
    },
    {
      id: 4,
      imgSrc: '/assets/images/landingpage/profile/sebastian_perfil.png',
      name: 'Sebastian Paredes',
      subtext: 'Ingeniero de Software',
      description: 'Soy Sebastian, estudiante del noveno ciclo de Ingeniería de Software. A lo largo de mi formación he adquirido experiencia trabajando con diversos lenguajes como C++, Python, C# y Java, aplicando principios de programación orientada a objetos.'
    },
    {
      id: 5,
      imgSrc: '/assets/images/landingpage/profile/salvador_perfil.jpg',
      name: 'Salvador Salinas',
      subtext: 'Ingeniero de Software',
      description: 'Soy Salvador y actualmente curso el noveno ciclo de la carrera de Ingeniería de Software. Poseo conocimientos en programación orientada a objetos, desarrollo de backend, frontend web y móvil, y CI/CD. Considero que soy una persona responsable y organizada con los tiempos.'
    },
  ];

  users: users[] = [
    {
      id: 1,
      icon: 'building-cottage',
      title: 'Productores agrícolas',
      subtext:
        'Encuentra asesores, agenda citas y centraliza recomendaciones para tomar decisiones con mejor contexto y seguimiento.',
    },
    {
      id: 2,
      icon: 'user-circle',
      title: 'Asesores especializados',
      subtext:
        'Publica contenido, administra tu disponibilidad y acompaña a más productores con una experiencia simple y ordenada.',
    }
  ];
}
