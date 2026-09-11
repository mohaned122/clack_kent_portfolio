import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { articles } from '../data/articles.data';

declare function clarkInit(): void;

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss',
})
export class BlogListComponent implements AfterViewInit {
  protected readonly articles = articles;

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