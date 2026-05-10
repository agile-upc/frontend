import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import './locale-init';

const PROFILE_PLACEHOLDER = '/assets/images/placeholders/profile.jpg';
const CONTENT_PLACEHOLDER = '/assets/images/placeholders/post.jpg';

function pickFallbackImage(image: HTMLImageElement): string {
  const explicitFallback = image.getAttribute('data-fallback-src');
  if (explicitFallback) {
    return explicitFallback;
  }

  const className = image.className || '';
  const width = image.width || Number(image.getAttribute('width')) || 0;
  const isAvatarLike =
    className.includes('rounded-circle') ||
    className.includes('profile-dd') ||
    className.includes('mat-card-avatar') ||
    width > 0 && width <= 160;

  return isAvatarLike ? PROFILE_PLACEHOLDER : CONTENT_PLACEHOLDER;
}

document.addEventListener(
  'error',
  (event) => {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) {
      return;
    }

    const fallbackSrc = pickFallbackImage(target);
    const currentSource = target.currentSrc || target.src;
    if (target.dataset['fallbackApplied'] === 'true' || currentSource.includes(fallbackSrc)) {
      return;
    }

    target.dataset['fallbackApplied'] = 'true';
    target.src = fallbackSrc;
  },
  true
);

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
