import { Component, AfterViewInit } from '@angular/core';

declare function clarkInit(): void;

@Component({
  selector: 'app-blog',
  templateUrl: './blog.html',
  styleUrls: ['./blog.scss']
})
export class BlogComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    if (typeof clarkInit === 'function') {
      clarkInit();
    }
  }
}