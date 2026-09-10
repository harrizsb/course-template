export interface KaplayGameConfig {
  id: string;
  title: string;
  description: string;
  controls: string[];
}

export interface Assignment {
  id: number;
  title: string;
  due: string;
  weight: number;
  description: string;
  requirements: string[];
  kaplay: KaplayGameConfig;
}

export const assignments: Assignment[] = [
  { id: 1, title: 'Personal portfolio in Astro', due: '11/09/2026', weight: 10, description: 'Build a statically generated personal portfolio site with Astro. Practice routing, layouts, component composition, and a design-system-based visual language.', requirements: ['Git repository with README', 'Deployed static build', 'Accessible navigation'], kaplay: { id: 'game-portfolio', title: 'Portfolio Path', description: 'Collect design tokens to build your portfolio.', controls: ['Left/Right arrows', 'Space to jump'] } },
  { id: 2, title: 'Design system audit and mockup', due: '25/09/2026', weight: 10, description: 'Audit an existing public website against Starwind UI design guidelines. Produce a written audit plus redesigned mockups.', requirements: ['Written audit (PDF)', 'Redesigned mockups', '5-minute presentation'], kaplay: { id: 'game-audit', title: 'Audit Alley', description: 'Find and fix design system violations.', controls: ['Left/Right arrows', 'Space to jump'] } },
  { id: 3, title: 'Team project: milestone 1 (core features)', due: '16/10/2026', weight: 15, description: 'Team milestone implementing core application features with data loading, forms, and API endpoints.', requirements: ['Feature-complete core flow', 'CI pipeline', 'Milestone report'], kaplay: { id: 'game-core', title: 'Core Loop', description: 'Connect the data flow endpoints.', controls: ['Left/Right arrows', 'Space to jump'] } },
  { id: 4, title: 'Accessibility remediation report', due: '30/10/2026', weight: 10, description: 'Run automated and manual accessibility audits on your team project, then remediate all findings.', requirements: ['Axe/Lighthouse reports', 'Keyboard navigation script', 'Remediation changelog'], kaplay: { id: 'game-a11y', title: 'A11y Guardian', description: 'Clear the path for assistive technology.', controls: ['Left/Right arrows', 'Space to jump'] } },
  { id: 5, title: 'Team project: milestone 2 (polish and performance)', due: '20/11/2026', weight: 15, description: 'Final team milestone: meet performance budgets, pass accessibility checks, add test coverage.', requirements: ['Core Web Vitals passing', 'Unit tests', 'Production deployment'], kaplay: { id: 'game-perf', title: 'Performance Sprint', description: 'Optimize the critical rendering path.', controls: ['Left/Right arrows', 'Space to jump'] } },
  { id: 6, title: 'Final project presentation', due: '04/12/2026', weight: 10, description: 'Present your team project: architecture decisions, trade-offs, live demo, and retrospective.', requirements: ['Presentation slides', 'Live demo', 'Individual retrospective'], kaplay: { id: 'game-final', title: 'Launch Storyteller', description: 'Present the final architecture and retrospective.', controls: ['Left/Right arrows', 'Space to jump'] } },
];
