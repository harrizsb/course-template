export interface Assignment {
  id: number;
  title: string;
  due: string;
  weight: number;
  description: string;
  requirements: string[];
}

export const assignments: Assignment[] = [
  { id: 1, title: 'Personal portfolio in Astro', due: 'Sep 11, 2026', weight: 10, description: 'Build a statically generated personal portfolio site with Astro. Practice routing, layouts, component composition, and a design-system-based visual language.', requirements: ['Git repository with README', 'Deployed static build', 'Accessible navigation'] },
  { id: 2, title: 'Design system audit and mockup', due: 'Sep 25, 2026', weight: 10, description: 'Audit an existing public website against Starwind UI design guidelines. Produce a written audit plus redesigned mockups.', requirements: ['Written audit (PDF)', 'Redesigned mockups', '5-minute presentation'] },
  { id: 3, title: 'Team project: milestone 1 (core features)', due: 'Oct 16, 2026', weight: 15, description: 'Team milestone implementing core application features with data loading, forms, and API endpoints.', requirements: ['Feature-complete core flow', 'CI pipeline', 'Milestone report'] },
  { id: 4, title: 'Accessibility remediation report', due: 'Oct 30, 2026', weight: 10, description: 'Run automated and manual accessibility audits on your team project, then remediate all findings.', requirements: ['Axe/Lighthouse reports', 'Keyboard navigation script', 'Remediation changelog'] },
  { id: 5, title: 'Team project: milestone 2 (polish and performance)', due: 'Nov 20, 2026', weight: 15, description: 'Final team milestone: meet performance budgets, pass accessibility checks, add test coverage.', requirements: ['Core Web Vitals passing', 'Unit tests', 'Production deployment'] },
  { id: 6, title: 'Final project presentation', due: 'Dec 4, 2026', weight: 10, description: 'Present your team project: architecture decisions, trade-offs, live demo, and retrospective.', requirements: ['Presentation slides', 'Live demo', 'Individual retrospective'] },
];
