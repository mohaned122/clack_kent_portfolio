import { Component, AfterViewInit, computed, inject, signal, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ArticleService } from '../services/article.service';
import { Article, ArticleComment } from '../models/article.model';
import { revealAnimated } from '../utils/reveal.util';

declare function clarkInit(): void;

@Component({
  selector: 'app-blog',
  imports: [RouterLink, FormsModule],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class BlogComponent implements AfterViewInit, OnDestroy {
  private readonly articleService = inject(ArticleService);

  protected readonly article = signal<Article | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly notFound = signal(false);

  protected readonly comments = signal<ArticleComment[]>([]);
  protected readonly commentsLoading = signal(true);
  protected readonly commentsError = signal(false);

  protected readonly sidebarArticles = signal<Article[]>([]);

  protected readonly commentName = signal('');
  protected readonly commentEmail = signal('');
  protected readonly commentWebsite = signal('');
  protected readonly commentMessage = signal('');
  protected readonly commentSubmitting = signal(false);
  protected readonly commentSubmitted = signal(false);
  protected readonly commentSubmitError = signal(false);

  protected readonly contentParagraphs = computed(() => {
    const article = this.article();
    return article && article.content ? article.content.split(/\n\n+/) : [];
  });

  private readonly route = inject(ActivatedRoute);
  private paramSubscription: Subscription | null = null;
  private articleSubscription: Subscription | null = null;
  private commentsSubscription: Subscription | null = null;
  private sidebarSubscription: Subscription | null = null;
  private currentArticleId: string | null = null;

  constructor() {
    this.paramSubscription = this.route.paramMap.subscribe((params) => {
      const id = params.get('id') ?? '';
      this.currentArticleId = id;
      this.loadArticle(id);
      this.loadComments(id);
    });
  }

  ngAfterViewInit(): void {
    if (typeof clarkInit === 'function') {
      try {
        clarkInit();
      } catch {
        // Legacy jQuery init must never block the page.
      }
    }
    this.sidebarSubscription = this.articleService.getAll().subscribe({
      next: (list) => {
        const others = list
          .filter((a) => a.id !== this.currentArticleId)
          .slice(0, 3);
        this.sidebarArticles.set(others);
        this.revealDynamic();
      },
      error: () => undefined,
    });
  }

  ngOnDestroy(): void {
    this.paramSubscription?.unsubscribe();
    this.articleSubscription?.unsubscribe();
    this.commentsSubscription?.unsubscribe();
    this.sidebarSubscription?.unsubscribe();
  }

  protected submitComment(): void {
    this.commentSubmitted.set(false);
    this.commentSubmitError.set(false);
    const name = this.commentName().trim();
    const email = this.commentEmail().trim();
    const message = this.commentMessage().trim();
    if (!name || !email || !message || !this.currentArticleId) {
      this.commentSubmitError.set(true);
      return;
    }
    this.commentSubmitting.set(true);
    this.articleService
      .addComment(this.currentArticleId, { name, email, message, createdAt: new Date() })
      .then(
        () => {
          this.commentSubmitting.set(false);
          this.commentSubmitted.set(true);
          this.commentName.set('');
          this.commentEmail.set('');
          this.commentWebsite.set('');
          this.commentMessage.set('');
        },
        (err) => {
          console.error('Comment failed:', err);
          this.commentSubmitting.set(false);
          this.commentSubmitError.set(true);
        }
      );
  }

  protected commentDate(comment: ArticleComment): string {
    return this.formatDate(comment.createdAt);
  }

  protected formatDate(value: Date | unknown): string {
    if (!value) {
      return '';
    }
    const date = (value as { toDate?: () => Date }).toDate ? (value as { toDate: () => Date }).toDate() : new Date(value as Date);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  private loadArticle(id: string): void {
    this.articleSubscription?.unsubscribe();
    this.loading.set(true);
    this.error.set(false);
    this.notFound.set(false);
    this.articleSubscription = this.articleService.getById(id).subscribe({
      next: (article) => {
        this.article.set(article);
        this.loading.set(false);
        this.revealDynamic();
      },
      error: (err) => {
        console.error('Article load failed:', err);
        this.loading.set(false);
        this.article.set(null);
        this.notFound.set(true);
        this.error.set(true);
      },
    });
  }

  private loadComments(id: string): void {
    this.commentsSubscription?.unsubscribe();
    this.commentsLoading.set(true);
    this.commentsError.set(false);
    this.commentsSubscription = this.articleService.getComments(id).subscribe({
      next: (list) => {
        this.comments.set(list);
        this.commentsLoading.set(false);
      },
      error: (err) => {
        console.error('Comments load failed:', err);
        this.commentsLoading.set(false);
        this.commentsError.set(true);
      },
    });
  }

  private revealDynamic(): void {
    revealAnimated('app-blog .ftco-animate');
  }
}