import { Component, AfterViewInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { projects } from '../data/projects.data';

declare function clarkInit(): void;

@Component({
  selector: 'app-projects',
  imports: [RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class Projects implements AfterViewInit {
  protected readonly allProjects = projects;

  protected readonly searchTerm = signal('');
  protected readonly selectedYear = signal<string>('all');
  protected readonly selectedTech = signal<string>('all');

  protected readonly years = Array.from(
    new Set(projects.map((p) => p.createdAt.getFullYear()))
  ).sort((a, b) => b - a);

  protected readonly technologies = Array.from(
    new Set(projects.flatMap((p) => p.technologies))
  ).sort((a, b) => a.localeCompare(b));

  protected readonly filteredProjects = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const year = this.selectedYear();
    const tech = this.selectedTech();
    return this.allProjects.filter((project) => {
      const matchesTerm = !term || project.title.toLowerCase().includes(term);
      const matchesYear =
        year === 'all' || project.createdAt.getFullYear() === Number(year);
      const matchesTech =
        tech === 'all' || project.technologies.includes(tech);
      return matchesTerm && matchesYear && matchesTech;
    });
  });

  setSearch(value: string): void {
    this.searchTerm.set(value);
  }

  setYear(value: string): void {
    this.selectedYear.set(value);
  }

  setTech(value: string): void {
    this.selectedTech.set(value);
  }

  resetFilters(): void {
    this.searchTerm.set('');
    this.selectedYear.set('all');
    this.selectedTech.set('all');
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