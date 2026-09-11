import { Project } from '../models/project.model';

export const projects: Project[] = [
  {
    id: '1',
    title: 'Branding & Illustration Design',
    category: 'Web Design',
    image: 'images/project-4.jpg',
    problem:
      'Create a distinctive brand identity that communicates the studio’s personality and stays memorable across print and digital.\n\nThe goal was a cohesive visual language with a clear story behind every color, shape, and detail.',
    solution:
      'A full identity system built from custom illustration, typography and color, delivered as a style guide with adaptable templates for social, web and print.',
    technologies: ['Photoshop', 'Illustrator', 'HTML5', 'CSS3'],
    featured: true,
    duration: '4 weeks',
    role: 'Brand Designer',
    createdAt: new Date(2024, 4, 12),
  },
  {
    id: '2',
    title: 'WordPress Corporate Website',
    category: 'Web Development',
    image: 'images/project-5.jpg',
    problem:
      'The client needed a modern corporate presence that loads fast, ranks well, and lets the team edit content without touching code.\n\nThe previous site was static, slow to update, and difficult to maintain.',
    solution:
      'A custom WordPress theme built around reusable blocks, with optimized assets, clean SEO structure and an intuitive editing experience.',
    technologies: ['WordPress', 'PHP', 'HTML5', 'CSS3'],
    featured: true,
    duration: '6 weeks',
    role: 'Web Developer',
    createdAt: new Date(2023, 8, 3),
  },
  {
    id: '3',
    title: 'E-Learning UI Design',
    category: 'UI Design',
    image: 'images/project-1.jpg',
    problem:
      'Design a learning experience that keeps students engaged and makes course navigation feel effortless on every device.\n\nExisting screens were cluttered and inconsistent across mobile and desktop.',
    solution:
      'A modular component library and design system with clear hierarchy, accessible contrast, and a calm visual style focused on readability.',
    technologies: ['Figma', 'Adobe XD', 'Photoshop'],
    featured: false,
    duration: '3 weeks',
    role: 'UI/UX Designer',
    createdAt: new Date(2022, 11, 18),
  },
  {
    id: '4',
    title: 'Restaurant Landing Page',
    category: 'Web Design',
    image: 'images/project-6.jpg',
    problem:
      'Turn a busy menu and a few photos into a one-page experience that makes visitors hungry and, above all, call to book.\n\nThe page needed to feel warm, fast and easy to scan on a phone.',
    solution:
      'A single lightweight page with smooth scroll sections, image-led layout and subtle animations that guide the eye toward reservations.',
    technologies: ['HTML5', 'CSS3', 'jQuery', 'Bootstrap'],
    featured: false,
    duration: '2 weeks',
    role: 'Frontend Developer',
    createdAt: new Date(2021, 5, 27),
  },
  {
    id: '5',
    title: 'Web App Dashboard',
    category: 'Web Development',
    image: 'images/project-2.jpg',
    problem:
      'Build a real-time dashboard where non-technical users can track key metrics at a glance without being overwhelmed.\n\nData lived across multiple sources and needed a single, trusted view.',
    solution:
      'An Angular-based dashboard with Firebase for live updates, role-based access, and clean data visualizations tuned for readability.',
    technologies: ['Angular', 'TypeScript', 'Firebase', 'CSS3'],
    featured: true,
    duration: '8 weeks',
    role: 'Full-Stack Developer',
    createdAt: new Date(2020, 2, 15),
  },
  {
    id: '6',
    title: 'Mobile App Concept',
    category: 'Mobile Design',
    image: 'images/project-3.jpg',
    problem:
      'Explore how a food-ordering idea could feel on a phone before any code is written.\n\nThe concept needed to be simple enough to test with users quickly and cheaply.',
    solution:
      'An interactive prototype covering the core ordering flow, with polished screens ready to hand off to developers.',
    technologies: ['Flutter', 'Adobe XD', 'Photoshop'],
    featured: false,
    duration: '3 weeks',
    role: 'UI Designer',
    createdAt: new Date(2019, 9, 7),
  },
];