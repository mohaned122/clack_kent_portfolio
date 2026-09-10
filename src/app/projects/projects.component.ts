import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-projects',
  imports: [RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class Projects {
  protected readonly projects = [
    { id: 1, title: 'Branding & Illustration Design', category: 'Web Design', image: 'images/project-4.jpg' },
    { id: 2, title: 'Branding & Illustration Design', category: 'Web Design', image: 'images/project-5.jpg' },
    { id: 3, title: 'Branding & Illustration Design', category: 'Web Design', image: 'images/project-1.jpg' },
    { id: 4, title: 'Branding & Illustration Design', category: 'Web Design', image: 'images/project-6.jpg' },
    { id: 5, title: 'Branding & Illustration Design', category: 'Web Design', image: 'images/project-2.jpg' },
    { id: 6, title: 'Branding & Illustration Design', category: 'Web Design', image: 'images/project-3.jpg' },
  ];
}