export interface RubricCriterion {
  name: string;
  description: string;
  weight: number;
}

export interface AssignmentRubric {
  assignmentId: number;
  criteria: RubricCriterion[];
  /** Optional supporting rubric PDF exposed through the materials preview route. */
  pdfPath?: string;
}

export const rubrics: AssignmentRubric[] = [
  {
    assignmentId: 1,
    criteria: [
      { name: 'Architecture and routing', description: 'Uses Astro layouts, routes, and components with a coherent site structure.', weight: 25 },
      { name: 'Design system implementation', description: 'Applies Starwind components and semantic tokens consistently across the portfolio.', weight: 25 },
      { name: 'Accessibility and responsive UX', description: 'Provides semantic markup, keyboard-friendly navigation, and usable responsive layouts.', weight: 25 },
      { name: 'Deployment and documentation', description: 'Delivers a working static deployment with a clear README and reproducible setup.', weight: 25 },
    ],
  },
  {
    assignmentId: 2,
    criteria: [
      { name: 'Audit quality', description: 'Identifies design-system strengths and issues with specific, evidence-based findings.', weight: 30 },
      { name: 'Design rationale', description: 'Connects redesign decisions to Starwind patterns, semantic tokens, and user needs.', weight: 25 },
      { name: 'Mockup quality', description: 'Produces clear, consistent mockups that address the audit findings.', weight: 25 },
      { name: 'Communication', description: 'Presents the audit and redesign clearly within the time limit.', weight: 20 },
    ],
  },
  {
    assignmentId: 3,
    pdfPath: 'rubrics/midterm',
    criteria: [
      { name: 'Core functionality', description: 'Implements the agreed feature flow end to end, including loading, forms, and API behavior.', weight: 35 },
      { name: 'Technical integration', description: 'Integrates data access and error handling cleanly with the application architecture.', weight: 25 },
      { name: 'Engineering workflow', description: 'Uses meaningful commits, code review, and a reliable CI pipeline.', weight: 20 },
      { name: 'Milestone report', description: 'Documents decisions, trade-offs, known limitations, and each member contribution.', weight: 20 },
    ],
  },
  {
    assignmentId: 4,
    criteria: [
      { name: 'Audit coverage', description: 'Combines automated results with a thorough manual accessibility review.', weight: 25 },
      { name: 'Remediation impact', description: 'Fixes findings at their source and demonstrates improved user access.', weight: 35 },
      { name: 'Keyboard and assistive technology UX', description: 'Verifies focus order, names, states, and keyboard interaction paths.', weight: 25 },
      { name: 'Evidence and changelog', description: 'Reports before-and-after evidence and explains remaining limitations.', weight: 15 },
    ],
  },
  {
    assignmentId: 5,
    criteria: [
      { name: 'Performance', description: 'Meets the defined performance budgets and demonstrates healthy Core Web Vitals.', weight: 30 },
      { name: 'Reliability and test coverage', description: 'Adds meaningful unit or integration coverage for critical application behavior.', weight: 25 },
      { name: 'Production readiness', description: 'Ships a stable deployment with monitoring, error handling, and release documentation.', weight: 25 },
      { name: 'Polish and collaboration', description: 'Refines the experience and shows coordinated, reviewable team delivery.', weight: 20 },
    ],
  },
  {
    assignmentId: 6,
    pdfPath: 'rubrics/final-presentation',
    criteria: [
      { name: 'Architecture and trade-offs', description: 'Explains the system architecture and justifies important technical decisions.', weight: 30 },
      { name: 'Live demonstration', description: 'Demonstrates the deployed project reliably through a representative user flow.', weight: 30 },
      { name: 'Communication and presentation', description: 'Communicates clearly with an organized narrative, effective visuals, and pacing.', weight: 20 },
      { name: 'Retrospective', description: 'Reflects honestly on outcomes, trade-offs, collaboration, and future improvements.', weight: 20 },
    ],
  },
];

export const rubricByAssignment: Record<number, AssignmentRubric> = Object.fromEntries(
  rubrics.map((rubric) => [rubric.assignmentId, rubric]),
);
