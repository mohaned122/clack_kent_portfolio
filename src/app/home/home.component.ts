import { Component, AfterViewInit, OnDestroy, ElementRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CertCardComponent } from '../cert-card/cert-card.component';
import { ScrollService } from '../services/scroll.service';
import { CvService } from '../services/cv.service';
import { EducationService } from '../services/education.service';
import { InternshipService } from '../services/internship.service';
import { ArticleService } from '../services/article.service';
import { ProjectService } from '../services/project.service';
import { CertificateService } from '../services/certificate.service';
import { ContactService } from '../services/contact.service';
import { ImageFallbackService } from '../services/image-fallback.service';
import { SeoService } from '../services/seo.service';
import { Education } from '../models/education.model';
import { Internship } from '../models/internship.model';
import { Project } from '../models/project.model';
import { Certificate } from '../models/certificate.model';
import { ContactMessage } from '../models/contact.model';
import { Article } from '../models/article.model';
import { revealAnimated } from '../utils/reveal.util';

declare function clarkInit(): void;

@Component({
  selector: 'app-home',
  imports: [RouterLink, CertCardComponent, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy {

  protected readonly typedText = signal('');

  protected readonly articles = signal<Article[]>([]);
  protected readonly articlesLoading = signal(true);
  protected readonly articlesError = signal(false);

  protected readonly articleCommentCounts = signal<Record<string, number>>({});

  protected readonly homeCertificates = signal<Certificate[]>([]);
  protected readonly certificatesLoading = signal(true);
  protected readonly certificateError = signal(false);

  protected readonly contactSending = signal(false);
  protected readonly contactSent = signal(false);
  protected readonly contactError = signal(false);
  protected readonly contactSubmitted = signal(false);

  protected readonly allProjects = signal<Project[]>([]);
  protected readonly homeProjects = signal<Project[]>([]);
  protected readonly projectsLoading = signal(true);
  protected readonly projectError = signal(false);

  private readonly router = inject(Router);
  private readonly scrollService = inject(ScrollService);
  protected readonly cvService = inject(CvService);
  private readonly imageService = inject(ImageFallbackService);

  protected readonly educationEntries = signal<Education[]>([]);
  protected readonly internshipEntries = signal<Internship[]>([]);
  protected readonly educationError = signal(false);
  protected readonly internshipError = signal(false);

  private readonly educationService = inject(EducationService);
  private readonly internshipService = inject(InternshipService);
  private readonly projectService = inject(ProjectService);
  private readonly certificateService = inject(CertificateService);
  private readonly contactService = inject(ContactService);
  private readonly articleService = inject(ArticleService);
  private readonly seo = inject(SeoService);
  private educationSubscription: Subscription | null = null;
  private internshipSubscription: Subscription | null = null;
  private projectSubscription: Subscription | null = null;
  private certificateSubscription: Subscription | null = null;
  private articleSubscription: Subscription | null = null;
  private projectsRotationTimer: ReturnType<typeof setInterval> | null = null;

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
    this.projectSubscription = this.projectService.getProjects().subscribe({
      next: (list) => {
        this.allProjects.set(list);
        this.rotateHomeProjects();
        this.projectsLoading.set(false);
        if (this.projectsRotationTimer === null) {
          this.projectsRotationTimer = setInterval(() => this.rotateHomeProjects(), 30000);
        }
        this.revealProjects();
      },
      error: (err) => {
        console.error('Projects load failed:', err);
        this.projectsLoading.set(false);
        this.projectError.set(true);
      },
    });
    this.certificateSubscription = this.certificateService.getAll().subscribe({
      next: (list) => {
        const sorted = [...list].sort((a, b) => this.certDate(b) - this.certDate(a));
        this.homeCertificates.set(sorted.slice(0, 6));
        this.certificatesLoading.set(false);
        this.revealCertificates();
      },
      error: (err) => {
        console.error('Certificates load failed:', err);
        this.certificatesLoading.set(false);
        this.certificateError.set(true);
      },
    });
    this.articleSubscription = this.articleService.getAll().subscribe({
      next: (list) => {
        this.articles.set(list.slice(0, 3));
        this.articlesLoading.set(false);
        this.subscribeArticleCommentCounts(list.slice(0, 3));
        this.revealBlogCards();
      },
      error: (err) => {
        console.error('Articles load failed:', err);
        this.articlesLoading.set(false);
        this.articlesError.set(true);
      },
    });
    this.seo.setPersonSchema();
    this.seo.setMeta({
      title: 'Full-Stack Developer & Software Engineering Student',
      description:
        'Portfolio of Mohanned Zayoud — full-stack developer and software engineering student from Tunisia building web and mobile applications with Angular, Firebase, Flutter, and Spring Boot.',
      url: '/',
    });
  }

  protected goToContact(): void {
    this.navigateTo('contact-section');
  }

  protected sendContact(form: NgForm): void {
    this.contactSubmitted.set(true);
    if (form.invalid || this.contactSending()) {
      return;
    }
    this.contactSending.set(true);
    this.contactError.set(false);

    const message: ContactMessage = {
      name: form.value.name,
      email: form.value.email,
      subject: form.value.subject,
      message: form.value.message,
      createdAt: new Date(),
    };

    this.contactService.sendMessage(message).then(
      () => {
        this.contactSending.set(false);
        this.contactSent.set(true);
        this.contactSubmitted.set(false);
        form.resetForm();
      },
      (err) => {
        console.error('Contact message failed:', err);
        this.contactSending.set(false);
        this.contactError.set(true);
      }
    );
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
    if (this.projectsRotationTimer !== null) {
      clearInterval(this.projectsRotationTimer);
    }
    this.educationSubscription?.unsubscribe();
    this.internshipSubscription?.unsubscribe();
    this.projectSubscription?.unsubscribe();
    this.certificateSubscription?.unsubscribe();
    this.articleSubscription?.unsubscribe();
    this.commentCountSubscriptions.forEach((s) => s.unsubscribe());
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

  protected rotateHomeProjects(): void {
    this.homeProjects.set(pickRandomProjects(this.allProjects(), 6));
  }

  protected projectAt(index: number): Project | undefined {
    return this.homeProjects()[index];
  }

  protected projectBg(project: Project): string {
    return `url(${this.imageService.resolve(project.image, project.id)})`;
  }

  private revealProjects(): void {
    revealAnimated('#projects-section .ftco-animate');
  }

  private revealCertificates(): void {
    revealAnimated('#cetificates-section .ftco-animate');
  }

  private certDate(cert: Certificate): number {
    return this.toEpoch(cert.createdAt) || this.parseDateText(cert.date);
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

  private revealResumeCards(): void {
    revealAnimated('#resume-section .resume-wrap.ftco-animate');
  }

  private revealBlogCards(): void {
    revealAnimated('#blog-section .d-flex.ftco-animate');
  }

  protected blogCommentCount(blog: Article): number {
    return this.articleCommentCounts()[blog.id ?? ''] ?? 0;
  }

  protected blogExcerpt(blog: Article): string {
    const text = (blog.content || '').replace(/\s+/g, ' ').trim();
    if (!text) {
      return 'No preview available.';
    }
    const max = 100;
    if (text.length <= max) {
      return text;
    }
    const cut = text.slice(0, max);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '…';
  }

  private commentCountSubscriptions: Subscription[] = [];

  private subscribeArticleCommentCounts(list: Article[]): void {
    this.commentCountSubscriptions.forEach((s) => s.unsubscribe());
    this.commentCountSubscriptions = [];
    for (const article of list) {
      if (!article.id) continue;
      this.commentCountSubscriptions.push(
        this.articleService.getComments(article.id).subscribe({
          next: (comments) => {
            this.articleCommentCounts.update((map) => ({ ...map, [article.id!]: comments.length }));
          },
          error: () => undefined,
        })
      );
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

function pickRandomProjects<T>(items: T[], count: number): T[] {
  if (items.length <= count) {
    return [...items];
  }
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}