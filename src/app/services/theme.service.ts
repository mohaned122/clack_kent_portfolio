import { Injectable, inject, signal, DOCUMENT } from '@angular/core';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'clark-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly current = signal<Theme>('dark');

  readonly activeTheme = this.current.asReadonly();

  constructor() {
    const stored = this.readStored();
    const initial: Theme = stored === 'light' ? 'light' : 'dark';
    this.current.set(initial);
    this.apply(initial);
  }

  toggle(): void {
    const next: Theme = this.current() === 'dark' ? 'light' : 'dark';
    this.current.set(next);
    this.apply(next);
  }

  private apply(theme: Theme): void {
    const root = this.document.documentElement;
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }

    const themeColor = this.document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute('content', theme === 'light' ? '#f4f5f7' : '#0f0f11');
    }

    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // storage unavailable (e.g. private mode) — ignore
    }
  }

  private readStored(): string | null {
    try {
      return this.document.defaultView?.localStorage.getItem(STORAGE_KEY) ?? null;
    } catch {
      return null;
    }
  }
}