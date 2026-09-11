import { Component, AfterViewInit, inject, signal, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ArticleService } from '../services/article.service';
import { Article } from '../models/article.model';
import { SeoService } from '../services/seo.service';
import { revealAnimated } from '../utils/reveal.util';

declare function clarkInit(): void;

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss',
})
export class BlogListComponent implements AfterViewInit, OnDestroy {
  private readonly articleService = inject(ArticleService);
  private readonly seo = inject(SeoService);

  protected readonly articles = signal<Article[]>([]);
  protected readonly commentCounts = signal<Record<string, number>>({});
  protected readonly loading = signal(true);
  protected readonly error = signal(false);

  private subscription: Subscription | null = null;
  private commentSubscriptions: Subscription[] = [];

  ngAfterViewInit(): void {
    if (typeof clarkInit === 'function') {
      try {
        clarkInit();
      } catch {
        // Legacy jQuery init must never block the page.
      }
    }
    this.seo.setMeta({
      title: 'Blog',
      description:
        'Articles, tutorials, and updates by Mohanned Zayoud on full-stack development with Angular, Firebase, Flutter, Spring Boot, and modern web technologies.',
      url: '/blog',
    });
    this.subscription = this.articleService.getAll().subscribe({
      next: (list) => {
        this.articles.set(list);
        this.loading.set(false);
        this.subscribeCommentCounts(list);
        this.revealCards();
      },
      error: (err) => {
        console.error('Articles load failed:', err);
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.commentSubscriptions.forEach((s) => s.unsubscribe());
  }

  protected commentCount(article: Article): number {
    return this.commentCounts()[article.id ?? ''] ?? 0;
  }

  private subscribeCommentCounts(list: Article[]): void {
    this.commentSubscriptions.forEach((s) => s.unsubscribe());
    this.commentSubscriptions = [];
    for (const article of list) {
      if (!article.id) continue;
      this.commentSubscriptions.push(
        this.articleService.getComments(article.id).subscribe({
          next: (comments) => {
            this.commentCounts.update((map) => ({ ...map, [article.id!]: comments.length }));
          },
          error: () => undefined,
        })
      );
    }
  }

  private revealCards(): void {
    revealAnimated('app-blog-list .d-flex.ftco-animate');
  }
}