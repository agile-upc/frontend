import { Injectable, signal } from '@angular/core';
import { AppSettings, defaults } from '../config';

const SETTINGS_STORAGE_KEY = 'app-settings';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  private optionsSignal = signal<AppSettings>(this.loadInitialOptions());

  getOptions() {
    return this.optionsSignal();
  }

  setOptions(options: Partial<AppSettings>) {
    this.optionsSignal.update((current) => {
      const nextOptions = {
        ...current,
        ...options,
      };
      this.persistOptions(nextOptions);
      return nextOptions;
    });
  }

  setLanguage(lang: string) {
    this.setOptions({ language: lang });
  }

  getLanguage() {
    return this.getOptions().language;
  }

  private loadInitialOptions(): AppSettings {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return defaults;
    }

    try {
      return {
        ...defaults,
        ...(JSON.parse(raw) as Partial<AppSettings>),
      };
    } catch {
      return defaults;
    }
  }

  private persistOptions(options: AppSettings): void {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(options));
  }
}
