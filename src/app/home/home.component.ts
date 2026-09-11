import { Component, AfterViewInit, OnDestroy, ElementRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CertCardComponent } from '../cert-card/cert-card.component';
import { projects } from '../data/projects.data';
import { articles } from '../data/articles.data';
import { certificates } from '../data/certificates.data';
import { ScrollService } from '../services/scroll.service';
import { CvService } from '../services/cv.service';

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

  constructor(private readonly elementRef: ElementRef) {}

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