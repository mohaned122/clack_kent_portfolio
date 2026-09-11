import { Component, AfterViewInit, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { projects } from '../data/projects.data';

declare function clarkInit(): void;

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetail implements AfterViewInit {
  protected readonly projects = projects;

  private readonly id = signal<string>('1');

  protected readonly selectedProject = computed(
    () => this.projects.find((p) => p.id === this.id()) ?? this.projects[0]
  );

  protected readonly problemParagraphs = computed(
    () => this.selectedProject().problem.split(/\n\n+/)
  );

  constructor(private readonly route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
      this.id.set(params.get('id') ?? '1');
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
  }
}