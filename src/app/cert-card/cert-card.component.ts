import { Component, computed, inject, input, signal } from '@angular/core';
import { Certificate } from '../models/certificate.model';
import { ImageFallbackService } from '../services/image-fallback.service';

@Component({
  selector: 'app-cert-card',
  imports: [],
  templateUrl: './cert-card.component.html',
  styleUrl: './cert-card.component.scss',
})
export class CertCardComponent {
  readonly certificate = input.required<Certificate>();

  private readonly imageService = inject(ImageFallbackService);

  protected readonly flipped = signal(false);

  protected readonly certImage = computed(() => {
    const cert = this.certificate();
    return `url(${this.imageService.resolveCertificate(cert.image, cert.id)})`;
  });

  toggleFlip(): void {
    this.flipped.set(!this.flipped());
  }
}