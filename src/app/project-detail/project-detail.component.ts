import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetail {
  private readonly route = inject(ActivatedRoute);

  private readonly projects = [
    { id: 1, title: 'Branding & Illustration Design', category: 'Web Design', image: 'images/project-4.jpg' },
    { id: 2, title: 'Branding & Illustration Design', category: 'Web Design', image: 'images/project-5.jpg' },
    { id: 3, title: 'Branding & Illustration Design', category: 'Web Design', image: 'images/project-1.jpg' },
    { id: 4, title: 'Branding & Illustration Design', category: 'Web Design', image: 'images/project-6.jpg' },
    { id: 5, title: 'Branding & Illustration Design', category: 'Web Design', image: 'images/project-2.jpg' },
    { id: 6, title: 'Branding & Illustration Design', category: 'Web Design', image: 'images/project-3.jpg' },
  ];

  protected readonly selectedProject$ = this.route.paramMap.pipe(
    map((params) => {
      const id = Number(params.get('id'));
      return this.projects.find((project) => project.id === id) ?? this.projects[0];
    })
  );
}