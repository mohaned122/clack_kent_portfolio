import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BlogComponent } from './blog/blog.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'index.html', redirectTo: '' },
  { path: 'single.html', redirectTo: 'blog' },
  { path: '**', redirectTo: '' }
];