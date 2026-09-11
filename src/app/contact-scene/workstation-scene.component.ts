import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-workstation-scene',
  templateUrl: './workstation-scene.component.html',
  styleUrl: './workstation-scene.component.scss',
})
export class WorkstationSceneComponent {
  protected readonly rx = signal(-18);
  protected readonly ry = signal(-30);

  private dragging = false;
  private lastX = 0;
  private lastY = 0;
  private targetX = -18;
  private targetY = -30;
  private curX = -18;
  private curY = -30;
  private raf = 0;

  private readonly reduceMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor() {
    this.tick();
  }

  dragStart(e: PointerEvent): void {
    this.dragging = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
  }

  @HostListener('window:pointermove', ['$event'])
  onMove(e: PointerEvent): void {
    if (!this.dragging) return;
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.targetY += dx * 0.4;
    this.targetX = Math.min(10, Math.max(-40, this.targetX + dy * 0.3));
  }

  @HostListener('window:pointerup')
  @HostListener('window:pointerleave')
  onEnd(): void {
    this.dragging = false;
  }

  private tick = (): void => {
    this.raf = requestAnimationFrame(this.tick);
    if (!this.dragging && !this.reduceMotion) {
      this.targetY += 0.08;
    }
    this.curX += (this.targetX - this.curX) * 0.08;
    this.curY += (this.targetY - this.curY) * 0.08;
    this.rx.set(this.curX);
    this.ry.set(this.curY);
  };
}
