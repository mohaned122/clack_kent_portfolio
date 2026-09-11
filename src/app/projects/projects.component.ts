import { Component, AfterViewInit, OnDestroy, computed, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from '../models/project.model';
import { ProjectService } from '../services/project.service';
import { ImageFallbackService } from '../services/image-fallback.service';
import { SeoService } from '../services/seo.service';
import { revealAnimated } from '../utils/reveal.util';

declare function clarkInit(): void;

@Component({
  selector: 'app-projects',
  imports: [RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class Projects implements AfterViewInit, OnDestroy {
  protected readonly allProjects = signal<Project[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);

  protected readonly searchTerm = signal('');
  protected readonly selectedYear = signal<string>('all');
  protected readonly selectedTech = signal<string>('all');

  protected readonly years = computed(() =>
    Array.from(
      new Set(
        this.allProjects().map((p) => this.toDate(p.createdAt).getFullYear())
      )
    ).sort((a, b) => b - a)
  );

  protected readonly technologies = computed(() =>
    Array.from(
      new Set(this.allProjects().flatMap((p) => p.technologies))
    ).sort((a, b) => a.localeCompare(b))
  );

  protected readonly filteredProjects = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const year = this.selectedYear();
    const tech = this.selectedTech();
    return this.allProjects().filter((project) => {
      const matchesTerm = !term || project.title.toLowerCase().includes(term);
      const matchesYear =
        year === 'all' || this.toDate(project.createdAt).getFullYear() === Number(year);
      const matchesTech = tech === 'all' || project.technologies.includes(tech);
      return matchesTerm && matchesYear && matchesTech;
    });
  });

  private readonly projectService = inject(ProjectService);
  protected readonly imageService = inject(ImageFallbackService);
  private readonly seo = inject(SeoService);
  private subscription: Subscription | null = null;

  protected projectBg(project: Project): string {
    return `url(${this.imageService.resolve(project.image, project.id)})`;
  }

  setSearch(value: string): void {
    this.searchTerm.set(value);
    this.revealProjects();
  }

  setYear(value: string): void {
    this.selectedYear.set(value);
    this.revealProjects();
  }

  setTech(value: string): void {
    this.selectedTech.set(value);
    this.revealProjects();
  }

  resetFilters(): void {
    this.searchTerm.set('');
    this.selectedYear.set('all');
    this.selectedTech.set('all');
    this.revealProjects();
  }

  private revealProjects(): void {
    revealAnimated('#all-projects-section .ftco-animate');
  }

  protected toDate(value: unknown): Date {
    if (value instanceof Date) {
      return value;
    }
    if (value && typeof (value as { toDate?: () => Date }).toDate === 'function') {
      return (value as { toDate: () => Date }).toDate();
    }
    if (value && typeof (value as { seconds?: number }).seconds === 'number') {
      return new Date((value as { seconds: number }).seconds * 1000);
    }
    const d = new Date(value as string);
    return Number.isNaN(d.getTime()) ? new Date(0) : d;
  }

  constructor() {
    this.subscription = this.projectService.getProjects().subscribe({
      next: (list) => {
        this.allProjects.set(
          list.map((p) => ({ ...p, createdAt: this.toDate(p.createdAt) }))
        );
        this.loading.set(false);
        this.revealProjects();
      },
      error: (err) => {
        console.error('Projects load failed:', err);
        this.loading.set(false);
        this.error.set(true);
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
      title: 'Projects',
      description:
        'A portfolio of software projects by Mohanned Zayoud — web and mobile applications built with Angular, Firebase, Flutter, Spring Boot, Docker, and modern cloud technologies.',
      url: '/projects',
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
