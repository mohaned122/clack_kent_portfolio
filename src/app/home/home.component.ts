import { Component, AfterViewInit, OnDestroy, ElementRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CertCardComponent } from '../cert-card/cert-card.component';
import { projects } from '../data/projects.data';
import { articles } from '../data/articles.data';
import { certificates } from '../data/certificates.data';
import { ScrollService } from '../services/scroll.service';
import { CvService } from '../services/cv.service';
import { EducationService } from '../services/education.service';
import { InternshipService } from '../services/internship.service';
import { Education } from '../models/education.model';
import { Internship } from '../models/internship.model';

declare function clarkInit(): void;

@Component({
  selector: 'app-home',
  imports: [RouterLink, CertCardComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy {

  protected readonly typedText = signal('');

  protected readonly projects = projects;
  protected readonly articles = articles;
  protected readonly certificates = certificates;

  private readonly router = inject(Router);
  private readonly scrollService = inject(ScrollService);
  protected readonly cvService = inject(CvService);

  protected readonly educationEntries = signal<Education[]>([]);
  protected readonly internshipEntries = signal<Internship[]>([]);
  protected readonly educationError = signal(false);
  protected readonly internshipError = signal(false);

  private readonly educationService = inject(EducationService);
  private readonly internshipService = inject(InternshipService);
  private educationSubscription: Subscription | null = null;
  private internshipSubscription: Subscription | null = null;

  private readonly roleTitles = [
    'Software Engineer',
    'Full-Stack Developer',
    'Web Developer',
    'Mobile App Developer',
    'Backend Developer',
    'Frontend Developer',
    'Data Enthusiast',
    'Data Analyst',
    'Problem Solver',
    'Tech Enthusiast',
    'Open Source Developer',
    'Creative Developer'
  ];

  private titleIndex = 0;
  private readonly typeSpeed = 75;
  private readonly deleteSpeed = 42;
  private readonly holdTime = 1400;
  private readonly pauseTime = 350;

  private isDeleting = false;
  private typeTimer: ReturnType<typeof setTimeout> | null = null;
  private destroyed = false;
  private skillsObserver: IntersectionObserver | null = null;

  constructor(private readonly elementRef: ElementRef) {
    this.educationSubscription = this.educationService.getAll().subscribe({
      next: (entries) => {
        entries.sort((a, b) => this.sortKey(b) - this.sortKey(a));
        this.educationEntries.set(entries);
        this.revealResumeCards();
      },
      error: (err) => {
        console.error('Education load failed:', err);
        this.educationError.set(true);
      },
    });
    this.internshipSubscription = this.internshipService.getAll().subscribe({
      next: (entries) => {
        entries.sort((a, b) => this.sortKey(b) - this.sortKey(a));
        this.internshipEntries.set(entries);
        this.revealResumeCards();
      },
      error: (err) => {
        console.error('Internship load failed:', err);
        this.internshipError.set(true);
      },
    });
  }

  protected goToContact(): void {
    this.navigateTo('contact-section');
  }

  protected scrollToProjects(): void {
    this.navigateTo('projects-section');
  }

  private navigateTo(section: string): void {
    if (this.router.url === '/') {
      this.scrollService.scrollTo(section);
    } else {
      this.router.navigate(['/'], { fragment: section });
    }
  }

  ngAfterViewInit(): void {
    if (typeof clarkInit === 'function') {
      try {
        clarkInit();
      } catch {
        // Legacy jQuery init must never block the Angular animations below.
      }
    }
    this.startTyping();
    this.initSkillBars();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.typeTimer !== null) {
      clearTimeout(this.typeTimer);
    }
    if (this.skillsObserver !== null) {
      this.skillsObserver.disconnect();
    }
    this.educationSubscription?.unsubscribe();
    this.internshipSubscription?.unsubscribe();
  }

  private toEpoch(value: unknown): number {
    if (!value) {
      return 0;
    }
    if (typeof value === 'string') {
      const match = value.match(/^(\d{4})-?(\d{1,2})?/);
      if (!match) {
        return 0;
      }
      return new Date(Number(match[1]), (match[2] ? Number(match[2]) : 1) - 1, 1).getTime();
    }
    const fallback = value as { toMillis?: () => number; seconds?: number };
    if (typeof fallback.toMillis === 'function') {
      return fallback.toMillis();
    }
    const ms = typeof fallback.seconds === 'number' ? fallback.seconds * 1000 : new Date(value as never).getTime();
    return Number.isNaN(ms) ? 0 : ms;
  }

  private sortKey(entry: Education | Internship): number {
    return (
      this.toEpoch(entry.startDate) ||
      this.toEpoch(entry.endDate) ||
      this.toEpoch((entry as { createdAt?: unknown }).createdAt)
    );
  }

  protected formatDateRange(startDate: string, endDate?: string): string {
    if (!startDate) {
      return endDate ?? 'Present';
    }
    if (!endDate) {
      return `${startDate} - Present`;
    }
    return `${startDate} - ${endDate}`;
  }

  protected educationTitle(edu: Education): string {
    if (edu.title) {
      return edu.title;
    }
    if (edu.degree && edu.field) {
      return `${edu.degree} in ${edu.field}`;
    }
    return edu.degree || edu.field || 'Education';
  }

  protected internshipTitle(exp: Internship): string {
    return exp.position || exp.company || 'Internship';
  }

  private revealResumeCards(): void {
    setTimeout(() => {
      const cards = Array.from(
        this.elementRef.nativeElement.querySelectorAll(
          '#resume-section .resume-wrap.ftco-animate:not(.ftco-animated)'
        )
      ) as HTMLElement[];
      cards.forEach((card, index) => {
        setTimeout(() => card.classList.add('fadeInUp', 'ftco-animated'), index * 50);
      });
    }, 0);
  }

  private startTyping(): void {
    if (this.destroyed) {
      return;
    }

    const currentTitle = this.roleTitles[this.titleIndex % this.roleTitles.length];

    if (this.isDeleting) {
      this.typedText.set(currentTitle.substring(0, Math.max(0, this.typedText().length - 1)));
    } else {
      this.typedText.set(currentTitle.substring(0, this.typedText().length + 1));
    }

    let delay = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.isDeleting && this.typedText() === currentTitle) {
      this.isDeleting = true;
      delay = this.holdTime;
    } else if (this.isDeleting && this.typedText() === '') {
      this.isDeleting = false;
      this.titleIndex = (this.titleIndex + 1) % this.roleTitles.length;
      delay = this.pauseTime;
    }

    this.typeTimer = setTimeout(() => this.startTyping(), delay);
  }

  private initSkillBars(): void {
    const section = this.elementRef.nativeElement.querySelector('#skills-section') as HTMLElement | null;
    if (!section) {
      return;
    }

    const bars = Array.from(section.querySelectorAll('.progress-bar')) as HTMLElement[];
    if (bars.length === 0) {
      return;
    }

    this.resetSkillBars(bars);

    if (typeof IntersectionObserver === 'undefined') {
      this.animateSkillBars(bars);
      return;
    }

    this.skillsObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          this.animateSkillBars(bars);
          this.skillsObserver?.disconnect();
        }
      }
    }, { threshold: 0.05, rootMargin: '0px 0px -10% 0px' });

    this.skillsObserver.observe(section);
  }

  private resetSkillBars(bars: HTMLElement[]): void {
    for (const bar of bars) {
      bar.style.transition = 'none';
      bar.style.width = '0%';
      const label = bar.querySelector('span');
      if (label) {
        label.textContent = '0%';
      }
    }
  }

  private animateSkillBars(bars: HTMLElement[]): void {
    if (bars.length === 0) {
      return;
    }

    const reduceMotion =
      typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      for (const bar of bars) {
        const target = Number(bar.getAttribute('aria-valuenow')) || 0;
        bar.style.width = target + '%';
        const label = bar.querySelector('span');
        if (label) {
          label.textContent = target + '%';
        }
      }
      return;
    }

    const duration = 1300;
    const start = performance.now();

    const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

    const step = (now: number): void => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(progress);

      for (const bar of bars) {
        this.setBarProgress(bar, Number(bar.getAttribute('aria-valuenow')) || 0, eased);
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        for (const bar of bars) {
          this.setBarProgress(bar, Number(bar.getAttribute('aria-valuenow')) || 0, 1);
        }
      }
    };

    requestAnimationFrame(step);
  }

  private setBarProgress(bar: HTMLElement, target: number, eased: number): void {
    const current = Math.round(target * eased);
    bar.style.width = current + '%';
    const label = bar.querySelector('span');
    if (label) {
      label.textContent = current + '%';
    }
  }
}