import { Component, input, signal } from '@angular/core';
import { Certificate } from '../models/certificate.model';

@Component({
  selector: 'app-cert-card',
  imports: [],
  templateUrl: './cert-card.component.html',
  styleUrl: './cert-card.component.scss',
})
export class CertCardComponent {
  readonly certificate = input.required<Certificate>();

  protected readonly flipped = signal(false);

  toggleFlip(): void {
    this.flipped.set(!this.flipped());
  }
}