import { Injectable, signal } from '@angular/core';

export type CvLanguage = 'en' | 'fr';

@Injectable({ providedIn: 'root' })
export class CvService {
  readonly dialogOpen = signal(false);

  private readonly hrefs: Record<CvLanguage, string> = {
    en: 'assets/cv/cv-en.pdf',
    fr: 'assets/cv/cv-fr.pdf',
  };

  open(): void {
    this.dialogOpen.set(true);
  }

  close(): void {
    this.dialogOpen.set(false);
  }

  openPdf(language: CvLanguage): void {
    window.open(this.hrefs[language], '_blank', 'noopener,noreferrer');
    this.close();
  }
}