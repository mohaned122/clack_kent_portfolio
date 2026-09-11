import { Component, AfterViewInit, OnDestroy, computed, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CertCardComponent } from '../cert-card/cert-card.component';
import { Certificate } from '../models/certificate.model';
import { CertificateService } from '../services/certificate.service';
import { SeoService } from '../services/seo.service';
import { revealAnimated } from '../utils/reveal.util';

declare function clarkInit(): void;

@Component({
  selector: 'app-certifications',
  imports: [RouterLink, CertCardComponent],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.scss',
})
export class CertificationsComponent implements AfterViewInit, OnDestroy {
  protected readonly certificates = signal<Certificate[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);

  protected readonly activeYear = signal<string>('all');

  protected readonly years = computed(() =>
    Array.from(
      new Set(
        this.certificates()
          .map((c) => c.date)
          .filter((d): d is string => !!d)
      )
    ).sort((a, b) => {
      const ta = this.parseDateText(a);
      const tb = this.parseDateText(b);
      if (ta !== tb) {
        return tb - ta;
      }
      return a.localeCompare(b);
    })
  );

  protected readonly filtered = computed(() => {
    const year = this.activeYear();
    return year === 'all'
      ? this.certificates()
      : this.certificates().filter((c) => c.date === year);
  });

  private readonly certificateService = inject(CertificateService);
  private readonly seo = inject(SeoService);
  private subscription: Subscription | null = null;

  setYear(year: string): void {
    this.activeYear.set(year);
    this.revealPage();
  }

  constructor() {
    this.subscription = this.certificateService.getAll().subscribe({
      next: (list) => {
        this.certificates.set([...list].sort((a, b) => this.certDate(b) - this.certDate(a)));
        this.loading.set(false);
        this.revealPage();
      },
      error: (err) => {
        console.error('Certificates load failed:', err);
        this.loading.set(false);
        this.error.set(true);
        this.revealPage();
      },
    });
  }

  ngAfterViewInit(): void {
    if (typeof clarkInit === 'function') {
      try {
        clarkInit();
      } catch {
        // Legacy jQuery init must never block the page.
      }
    }
    this.seo.setMeta({
      title: 'Certifications',
      description:
        'Certifications earned by Mohanned Zayoud across software engineering, web development, data, and information technology.',
      url: '/certifications',
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private revealPage(): void {
    revealAnimated('.ftco-section .ftco-animate');
  }

  private certDate(cert: Certificate): number {
    return this.toEpoch(cert.createdAt) || this.parseDateText(cert.date);
  }

  private toEpoch(value: unknown): number {
    if (!value) {
      return 0;
    }
    if (typeof value === 'string') {
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? 0 : d.getTime();
    }
    const fallback = value as { toMillis?: () => number; seconds?: number };
    if (typeof fallback.toMillis === 'function') {
      return fallback.toMillis();
    }
    const ms = typeof fallback.seconds === 'number' ? fallback.seconds * 1000 : new Date(value as never).getTime();
    return Number.isNaN(ms) ? 0 : ms;
  }

  private parseDateText(value?: string): number {
    if (!value) {
      return 0;
    }
    const years = value.match(/\d{4}/g);
    if (!years) {
      return 0;
    }
    return new Date(Number(years[years.length - 1]), 5, 30).getTime();
  }
}