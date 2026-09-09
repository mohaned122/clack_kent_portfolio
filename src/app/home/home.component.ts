import { Component, AfterViewInit } from '@angular/core';

declare function clarkInit(): void;

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    if (typeof clarkInit === 'function') {
      clarkInit();
    }
  }
}