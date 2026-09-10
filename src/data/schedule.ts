import type { Assignment } from './assignments';

export interface Week {
  week: number;
  date: string;
  topic: string;
  readings: string[];
  /** Source paths under src/assets/materials/, resolved through materialByFile. */
  materials: string[];
  /** Assignment due this week, if any. Resolved against assignments and linked
   *  to /assignments/#assignment-<id> on the schedule page. */
  assignmentId?: Assignment['id'];
}

export const weeks: Week[] = [
  { week: 1, date: '24/08/2026', topic: 'Course overview; the modern web platform', readings: ['MDN: How does the Internet work?', 'Astro docs: Getting started'], materials: ['slides/week01.pdf'] },
  { week: 2, date: '31/08/2026', topic: 'Rendering strategies: SSR, SSG, ISR, CSR', readings: ['Astro docs: On-demand rendering', 'web.dev: Rendering on the Web'], materials: ['slides/week02.pdf'] },
  { week: 3, date: '07/09/2026', topic: 'Component architecture and design systems', readings: ['Starwind UI docs', 'Astro docs: Components'], materials: ['slides/week03.pdf'], assignmentId: 1 },
  { week: 4, date: '14/09/2026', topic: 'Routing, layouts, and data loading', readings: ['Astro docs: Data fetching', 'Astro docs: Routing'], materials: ['slides/week04.pdf'] },
  { week: 5, date: '21/09/2026', topic: 'Forms, actions, and progressive enhancement', readings: ['Astro docs: Actions', 'MDN: Web forms'], materials: ['slides/week05.pdf'], assignmentId: 2 },
  { week: 6, date: '28/09/2026', topic: 'APIs, endpoints, and data contracts', readings: ['Astro docs: Endpoints', 'MDN: Fetch API'], materials: ['slides/week06.pdf'] },
  { week: 7, date: '05/10/2026', topic: 'State management patterns', readings: ['Astro docs: Share state between islands', 'Nano Stores (GitHub)'], materials: ['slides/week07.pdf'] },
  { week: 8, date: '12/10/2026', topic: 'Midterm project checkpoint; code review workshop', readings: ['Team project rubric (Canvas)'], materials: ['rubrics/midterm.pdf'], assignmentId: 3 },
  { week: 9, date: '19/10/2026', topic: 'Accessibility: WCAG 2.1 AA in practice', readings: ['WAI: Introduction to Web Accessibility', 'Starwind UI docs'], materials: ['slides/week09.pdf'] },
  { week: 10, date: '26/10/2026', topic: 'Performance budgets and Core Web Vitals', readings: ['web.dev: Web Vitals', 'web.dev: Performance budgets 101'], materials: ['slides/week10.pdf'], assignmentId: 4 },
  { week: 11, date: '02/11/2026', topic: 'Testing strategies and CI/CD', readings: ['Testing Library docs', 'GitHub Actions docs'], materials: ['slides/week11.pdf'] },
  { week: 12, date: '09/11/2026', topic: 'Deployment pipelines and edge caching', readings: ['Cloudflare Pages docs', 'Vercel docs'], materials: ['slides/week12.pdf', 'handouts/freeze-checklist.pdf'] },
  { week: 13, date: '16/11/2026', topic: 'Final project presentations', readings: ['Atlassian: Agile retrospectives'], materials: ['slides/week13.pdf', 'rubrics/final-presentation.pdf'], assignmentId: 5 },
];
