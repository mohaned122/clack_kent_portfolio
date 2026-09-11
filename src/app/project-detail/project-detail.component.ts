import { Component, AfterViewInit, OnDestroy, computed, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from '../models/project.model';
import { ProjectService } from '../services/project.service';
import { ImageFallbackService } from '../services/image-fallback.service';
import { revealAnimated } from '../utils/reveal.util';

declare function clarkInit(): void;

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetail implements AfterViewInit, OnDestroy {
  protected readonly projects = signal<Project[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);

  protected readonly id = signal<string>('');

  protected readonly selectedProject = computed(
    () => this.projects().find((p) => p.id === this.id()) ?? null
  );

  protected readonly problemParagraphs = computed(
    () => this.selectedProject()?.problem.split(/\n\n+/) ?? []
  );

  private readonly route = inject(ActivatedRoute);
  private readonly projectService = inject(ProjectService);
  protected readonly imageService = inject(ImageFallbackService);
  private subscription: Subscription | null = null;
  private routeSubscription: Subscription | null = null;

  protected projectBg(project: Project): string {
    return `url(${this.imageService.resolve(project.image, project.id)})`;
  }

  private toDate(value: unknown): Date {
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
        this.projects.set(
          list.map((p) => ({ ...p, createdAt: this.toDate(p.createdAt) }))
        );
        this.loading.set(false);
        this.revealPage();
      },
      error: (err) => {
        console.error('Project load failed:', err);
        this.loading.set(false);
        this.error.set(true);
        this.revealPage();
      },
    });
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      this.id.set(params.get('id') ?? '');
      this.revealPage();
    });
  }

  private revealPage(): void {
    revealAnimated('.ftco-section .ftco-animate');
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

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
  }
}