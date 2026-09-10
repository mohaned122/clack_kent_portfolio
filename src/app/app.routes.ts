import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BlogComponent } from './blog/blog.component';
import { Projects } from './projects/projects.component';
import { ProjectDetail } from './project-detail/project-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'projects', component: Projects },
  { path: 'projects/:id', component: ProjectDetail },
  { path: 'index.html', redirectTo: '' },
  { path: 'single.html', redirectTo: 'blog' },
  { path: '**', redirectTo: '' }
];