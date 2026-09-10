import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly year = new Date().getFullYear();

  protected readonly navItems = [
    { id: 'home-section', label: 'Home' },
    { id: 'about-section', label: 'About' },
    { id: 'resume-section', label: 'Resume' },
    { id: 'services-section', label: 'Services' },
    { id: 'skills-section', label: 'Skills' },
    { id: 'cetificates-section', label: 'Certificates' },
    { id: 'contact-section', label: 'Contact' },
  ];

  constructor(private readonly router: Router) {}

  goToSection(section: string, event: Event): void {
    if (this.router.url === '/') {
      return;
    }
    event.preventDefault();
    this.router.navigate(['/'], { fragment: section });
  }
}