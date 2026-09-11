import { Component, OnInit, OnDestroy, inject, signal, DOCUMENT } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ScrollService } from './services/scroll.service';
import { CvService } from './services/cv.service';

interface NavItem {
  id: string;
  label: string;
  route?: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly scrollService = inject(ScrollService);
  private readonly document = inject(DOCUMENT);

  protected readonly cvService = inject(CvService);

  protected readonly year = new Date().getFullYear();

  protected readonly navItems: NavItem[] = [
    { id: 'home-section', label: 'Home' },
    { id: 'about-section', label: 'About' },
    { id: 'resume-section', label: 'Resume' },
    { id: 'services-section', label: 'Services' },
    { id: 'skills-section', label: 'Skills' },
    { id: 'projects-section', label: 'Projects' },
    { id: 'cetificates-section', label: 'Certifications' },
    { id: 'blog', label: 'Blog', route: '/blog' },
    { id: 'contact-section', label: 'Contact' },
  ];

  protected readonly activeItem = signal<string>('home-section');

  private readonly routeToNav: [RegExp, string][] = [
    [/^\/$/, 'home-section'],
    [/^\/blog/, 'blog'],
    [/^\/(?:project|projects)/, 'projects-section'],
    [/^\/certifications/, 'cetificates-section'],
  ];

  private readonly sectionIds = [
    'home-section',
    'about-section',
    'resume-section',
    'services-section',
    'skills-section',
    'projects-section',
    'cetificates-section',
    'contact-section',
  ];

  private navigationSubscription = this.router.events
    .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
    .subscribe(() => {
      const rawUrl = this.router.url;
      const path = rawUrl.split('?')[0].split('#')[0];
      const fragment = this.router.parseUrl(rawUrl).fragment ?? '';

      for (const [regexp, navId] of this.routeToNav) {
        if (regexp.test(path)) {
          this.activeItem.set(navId);
          return;
        }
      }

      if (path === '/' && fragment && this.sectionIds.includes(fragment)) {
        this.activeItem.set(fragment);
      } else {
        this.activeItem.set('home-section');
      }
    });

  private ticking = false;

  private readonly onScroll = (): void => {
    if (this.router.url !== '/' && !this.router.url.startsWith('/#')) {
      return;
    }
    if (this.ticking) {
      return;
    }
    this.ticking = true;
    requestAnimationFrame(() => {
      this.updateActiveSection();
      this.ticking = false;
    });
  };

  private readonly scrollHandlerBound = this.onScroll.bind(this);

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollHandlerBound, { passive: true });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollHandlerBound);
    this.navigationSubscription.unsubscribe();
  }

  protected goToSection(id: string, event: Event): void {
    event.preventDefault();
    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      this.scrollService.scrollTo(id);
      this.activeItem.set(id);
    } else {
      this.router.navigate(['/'], { fragment: id });
      this.activeItem.set(id);
    }
  }

  protected closeCvDialog(): void {
    this.cvService.close();
  }

  private updateActiveSection(): void {
    const offset = 180;
    let current = this.sectionIds[0];
    for (const id of this.sectionIds) {
      const el = this.document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= offset) {
        current = id;
      }
    }
    this.activeItem.set(current);
  }
}