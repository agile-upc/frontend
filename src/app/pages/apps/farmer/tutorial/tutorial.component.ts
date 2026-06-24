import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { TranslateModule } from '@ngx-translate/core';

interface TutorialStep {
  icon: string;
  titleKey: string;
  textKey: string;
}

@Component({
  selector: 'app-farmer-tutorial',
  standalone: true,
  imports: [CommonModule, RouterLink, MaterialModule, TablerIconsModule, TranslateModule],
  templateUrl: './tutorial.component.html',
  styleUrl: './tutorial.component.scss'
})
export class FarmerTutorialComponent {
  readonly steps: TutorialStep[] = [
    {
      icon: 'search',
      titleKey: 'tutorial.steps.search.title',
      textKey: 'tutorial.steps.search.text'
    },
    {
      icon: 'user-check',
      titleKey: 'tutorial.steps.profile.title',
      textKey: 'tutorial.steps.profile.text'
    },
    {
      icon: 'calendar-event',
      titleKey: 'tutorial.steps.schedule.title',
      textKey: 'tutorial.steps.schedule.text'
    },
    {
      icon: 'message-2',
      titleKey: 'tutorial.steps.message.title',
      textKey: 'tutorial.steps.message.text'
    },
    {
      icon: 'video',
      titleKey: 'tutorial.steps.join.title',
      textKey: 'tutorial.steps.join.text'
    },
    {
      icon: 'star',
      titleKey: 'tutorial.steps.review.title',
      textKey: 'tutorial.steps.review.text'
    }
  ];
}
