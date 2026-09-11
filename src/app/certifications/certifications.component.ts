import { Component, AfterViewInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CertCardComponent } from '../cert-card/cert-card.component';
import { certificates } from '../data/certificates.data';

declare function clarkInit(): void;

@Component({
  selector: 'app-certifications',
  imports: [RouterLink, CertCardComponent],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.scss',
})
export class CertificationsComponent implements AfterViewInit {
  protected readonly certificates = certificates;

  protected readonly activeYear = signal<string>('all');

  protected readonly years = Array.from(
    new Set(certificates.map((c) => c.date).filter((d): d is string => !!d))
  );

  protected readonly filtered = computed(() => {
    const year = this.activeYear();
    return year === 'all'
      ? this.certificates
      : this.certificates.filter((c) => c.date === year);
  });

  setYear(year: string): void {
    this.activeYear.set(year);
  }

  ngAfterViewInit(): void {
    if (typeof clarkInit === 'function') {
      try {
        clarkInit();
      } catch {
        // Legacy jQuery init must never block the page.
      }
    }
  }
}