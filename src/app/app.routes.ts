import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BlogComponent } from './blog/blog.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { Projects } from './projects/projects.component';
import { ProjectDetail } from './project-detail/project-detail.component';
import { CertificationsComponent } from './certifications/certifications.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'blog', component: BlogListComponent },
  { path: 'blog/:id', component: BlogComponent },
  { path: 'projects', component: Projects },
  { path: 'projects/:id', component: ProjectDetail },
  { path: 'project/:id', component: ProjectDetail },
  { path: 'certifications', component: CertificationsComponent },
  { path: 'index.html', redirectTo: '' },
  { path: 'single.html', redirectTo: 'blog' },
  { path: '**', redirectTo: '' }
];