import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CoreService } from 'src/app/services/core.service';
import { MaterialModule } from 'src/app/material.module';
import { DateAdapter } from '@angular/material/core';
import { BrandingComponent } from '../../../layouts/full/vertical/sidebar/branding.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface profiles {
  id: number;
  name: string;
  subtextKey: string;
  imgSrc: string;
  descriptionKey: string;
}

interface users {
  id: number;
  icon: string;
  titleKey: string;
  subtextKey: string;
}

@Component({
  selector: 'app-landingpage',
  imports: [MaterialModule, TablerIconsModule, RouterLink, BrandingComponent, TranslateModule],
  templateUrl: './landingpage.component.html',
})
export class AppLandingpageComponent {
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  options = this.settings.getOptions();
  readonly languages = [
    { language: 'Español', code: 'es', shortLabel: 'ES' },
    { language: 'Runasimi', code: 'qu', shortLabel: 'QU' },
    { language: 'Aymar aru', code: 'ay', shortLabel: 'AY' },
  ];
  selectedLanguage = this.languages[0];
  private htmlElement!: HTMLHtmlElement;

  constructor(
    private settings: CoreService,
    private scroller: ViewportScroller,
    private translate: TranslateService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.htmlElement = document.querySelector('html')!;
    const savedLanguage = localStorage.getItem('agrotech-language') ?? 'es';
    this.selectedLanguage = this.languages.find((lang) => lang.code === savedLanguage) ?? this.languages[0];
    this.translate.addLangs(this.languages.map((lang) => lang.code));
    this.translate.setDefaultLang('es');
    this.translate.use(this.selectedLanguage.code);
    this.dateAdapter.setLocale(this.resolveDateLocale(this.selectedLanguage.code));
    this.applyThemeClass(this.options.theme);
  }

  gotoDemos() {
    this.scroller.scrollToAnchor('demos');
  }

  setLightDark(theme: string): void {
    this.settings.setOptions({ theme });
    this.options = this.settings.getOptions();
    this.applyThemeClass(theme);
  }

  changeLanguage(lang: { language: string; code: string; shortLabel: string }): void {
    this.selectedLanguage = lang;
    this.translate.use(lang.code);
    this.dateAdapter.setLocale(this.resolveDateLocale(lang.code));
    this.settings.setLanguage(lang.code);
    localStorage.setItem('agrotech-language', lang.code);
  }

  private resolveDateLocale(lang: string): string {
    return ({ es: 'es-PE', qu: 'qu-PE', ay: 'ay-PE' } as Record<string, string>)[lang] ?? 'es-PE';
  }

  private applyThemeClass(theme: string): void {
    if (theme === 'dark') {
      this.htmlElement.classList.add('dark-theme');
      this.htmlElement.classList.remove('light-theme');
      return;
    }

    this.htmlElement.classList.remove('dark-theme');
    this.htmlElement.classList.add('light-theme');
  }

  profiles: profiles[] = [
    {
      id: 1,
      imgSrc: '/assets/images/landingpage/profile/piero_perfil.jpg',
      name: 'Piero Delgado',
      subtextKey: 'landing.team.role',
      descriptionKey: 'landing.team.piero'
    },
    {
      id: 2,
      imgSrc: '/assets/images/landingpage/profile/ariana_perfil.png',
      name: 'Ariana Vargas',
      subtextKey: 'landing.team.role',
      descriptionKey: 'landing.team.ariana'
    },
    {
      id: 3,
      imgSrc: '/assets/images/landingpage/profile/mauricio_perfil.png',
      name: 'Mauricio Salas',
      subtextKey: 'landing.team.role',
      descriptionKey: 'landing.team.mauricio'
    },
    {
      id: 4,
      imgSrc: '/assets/images/landingpage/profile/sebastian_perfil.png',
      name: 'Sebastian Paredes',
      subtextKey: 'landing.team.role',
      descriptionKey: 'landing.team.sebastian'
    },
    {
      id: 5,
      imgSrc: '/assets/images/landingpage/profile/salvador_perfil.jpg',
      name: 'Salvador Salinas',
      subtextKey: 'landing.team.role',
      descriptionKey: 'landing.team.salvador'
    },
  ];

  users: users[] = [
    {
      id: 1,
      icon: 'building-cottage',
      titleKey: 'landing.users.farmers.title',
      subtextKey: 'landing.users.farmers.text',
    },
    {
      id: 2,
      icon: 'user-circle',
      titleKey: 'landing.users.advisors.title',
      subtextKey: 'landing.users.advisors.text',
    }
  ];
}
