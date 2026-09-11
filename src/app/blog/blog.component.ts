import { Component, AfterViewInit, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { articles } from '../data/articles.data';

declare function clarkInit(): void;

@Component({
  selector: 'app-blog',
  imports: [RouterLink],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class BlogComponent implements AfterViewInit {
  protected readonly articles = articles;

  protected readonly article = signal(this.articles[0]);

  protected readonly contentParagraphs = computed(() => {
    const article = this.article();
    return article.content.split(/\n\n+/);
  });

  constructor(private readonly route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') ?? '1';
      const found = articles.find((a) => a.id === id) ?? this.articles[0];
      this.article.set(found);
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
  }
}