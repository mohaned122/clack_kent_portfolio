import { Injectable, signal } from '@angular/core';

const FALLBACK_IMAGES = [
  'images/project-1.jpg',
  'images/project-2.jpg',
  'images/project-3.jpg',
  'images/project-4.jpg',
  'images/project-5.jpg',
  'images/project-6.jpg',
];

@Injectable({ providedIn: 'root' })
export class ImageFallbackService {
  private readonly failed = signal<ReadonlySet<string>>(new Set());
  private readonly pending = new Set<string>();

  resolve(raw: string | null | undefined, key?: string): string {
    const url = raw?.trim();
    if (!url || this.failed().has(url)) {
      return this.fallbackFor(key);
    }
    this.verify(url);
    return url;
  }

  private verify(url: string): void {
    if (this.pending.has(url)) {
      return;
    }
    this.pending.add(url);
    const img = new Image();
    img.onload = () => {
      this.pending.delete(url);
    };
    img.onerror = () => {
      this.pending.delete(url);
      this.failed.update((current) => {
        const next = new Set(current);
        next.add(url);
        return next;
      });
    };
    img.src = url;
  }

  private fallbackFor(key?: string): string {
    if (!key) {
      return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
    }
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    }
    return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
  }
}