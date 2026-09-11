import { Injectable, signal } from '@angular/core';

export type AdminTab =
  | 'projects'
  | 'certificates'
  | 'articles'
  | 'education'
  | 'internship'
  | 'messages';

export interface AdminTabItem {
  id: AdminTab;
  label: string;
}

@Injectable({ providedIn: 'root' })
export class AdminNavService {
  readonly activeTab = signal<AdminTab>('projects');
  readonly messageCount = signal(0);

  readonly tabs: AdminTabItem[] = [
    { id: 'projects', label: 'Projects' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'articles', label: 'Articles' },
    { id: 'education', label: 'Education' },
    { id: 'internship', label: 'Internships' },
    { id: 'messages', label: 'Messages' },
  ];

  setTab(tab: AdminTab): void {
    this.activeTab.set(tab);
  }
}