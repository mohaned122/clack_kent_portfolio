import { Component, OnInit, OnDestroy, inject, signal, DOCUMENT } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  imports: [],
  templateUrl: './scroll-top.component.html',
  styleUrl: './scroll-top.component.scss',
})
export class ScrollTopComponent implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);

  protected readonly visible = signal(false);

  private ticking = false;

  private readonly onScroll = (): void => {
    if (this.ticking) {
      return;
    }
    this.ticking = true;
    requestAnimationFrame(() => {
      this.update();
      this.ticking = false;
    });
  };

  private readonly onScrollBound = this.onScroll.bind(this);

  ngOnInit(): void {
    this.document.defaultView?.addEventListener('scroll', this.onScrollBound, { passive: true });
    this.update();
  }

  ngOnDestroy(): void {
    this.document.defaultView?.removeEventListener('scroll', this.onScrollBound);
  }

  protected scrollToTop(): void {
    const windowRef = this.document.defaultView;
    if (!windowRef) {
      return;
    }
    const reduce = windowRef.matchMedia('(prefers-reduced-motion: reduce)').matches;
    windowRef.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }

  private update(): void {
    const y = this.document.defaultView?.scrollY ?? 0;
    this.visible.set(y > 480);
  }
}