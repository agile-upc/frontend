import { Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd, ActivatedRoute, Data } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { TablerIconsModule } from 'angular-tabler-icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-breadcrumb',
    imports: [RouterModule, TablerIconsModule, TranslateModule],
    templateUrl: './breadcrumb.component.html',
    styleUrls: []
})
export class AppBreadcrumbComponent {
  // @Input() layout;
  pageInfo: Data | any = Object.create(null);
  myurl: any = this.router.url.slice(1).split('/');
  private readonly destroy$ = new Subject<void>();
  private currentTitleKey = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private translate: TranslateService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .pipe(filter((route) => route.outlet === 'primary'))
      .pipe(mergeMap((route) => route.data))
      .pipe(takeUntil(this.destroy$))
      // tslint:disable-next-line - Disables all
      .subscribe((event) => {
        // tslint:disable-next-line - Disables all
        this.pageInfo = event;
        this.currentTitleKey = event['title'] ?? '';
        this.updateDocumentTitle();
      });

    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateDocumentTitle());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateDocumentTitle(): void {
    if (!this.currentTitleKey) {
      this.titleService.setTitle('AgroTech');
      return;
    }

    this.translate
      .get(this.currentTitleKey)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedTitle) => {
        this.titleService.setTitle(`${translatedTitle} - AgroTech`);
      });
  }
}
