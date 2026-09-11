import { Certificate } from '../models/certificate.model';

export const certificates: Certificate[] = [
  {
    id: '1',
    title: 'Master Degree of Design',
    issuer: 'Cambridge University',
    date: '2014-2015',
    image: 'images/image_1.jpg',
    link: '',
    description:
      'A deep dive into visual communication, design principles and creative direction, completed with a research-driven thesis project.',
    createdAt: new Date(2015, 5, 30),
  },
  {
    id: '2',
    title: 'Bachelor’s Degree of C.A',
    issuer: 'Cambridge University',
    date: '2014-2015',
    image: 'images/image_2.jpg',
    link: '',
    description:
      'A foundation covering computer science fundamentals, mathematics and problem solving grounded in practical assignments.',
    createdAt: new Date(2015, 5, 30),
  },
  {
    id: '3',
    title: 'Diploma in Computer',
    issuer: 'Cambridge University',
    date: '2014-2015',
    image: 'images/image_3.jpg',
    link: '',
    description:
      'Hands-on training in operating systems, office automation and the basics of algorithms and programming logic.',
    createdAt: new Date(2015, 5, 30),
  },
  {
    id: '4',
    title: 'Art & Creative Director',
    issuer: 'Cambridge University',
    date: '2014-2015',
    image: 'images/project-1.jpg',
    link: '',
    description:
      'Leading creative projects from brief to delivery, focusing on art direction, storytelling and cross-team collaboration.',
    createdAt: new Date(2015, 5, 30),
  },
  {
    id: '5',
    title: 'Wordpress Developer',
    issuer: 'Cambridge University',
    date: '2014-2015',
    image: 'images/project-2.jpg',
    link: '',
    description:
      'Building and customizing WordPress sites with themes, plugins and performance best practices for real client projects.',
    createdAt: new Date(2015, 5, 30),
  },
  {
    id: '6',
    title: 'UI/UX Designer',
    issuer: 'Cambridge University',
    date: '2017-2018',
    image: 'images/project-3.jpg',
    link: '',
    description:
      'User-centered interface design: research, wireframes, prototyping and usability testing for responsive products.',
    createdAt: new Date(2018, 5, 30),
  },
];