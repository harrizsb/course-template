export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  levels: {
    high: string;
    middle: string;
    lower: string;
  };
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
      { id: 'a1-architecture', name: 'Architecture and routing', description: 'Uses Astro layouts, routes, and components with a coherent site structure.', weight: 25, levels: { high: 'Clear layouts, routes, and component hierarchy with consistent patterns.', middle: 'Functional structure with minor inconsistencies.', lower: 'Fragmented structure or missing key components.' } },
      { id: 'a1-design', name: 'Design system implementation', description: 'Applies Starwind components and semantic tokens consistently across the portfolio.', weight: 25, levels: { high: 'Consistent Starwind usage and semantic tokens throughout.', middle: 'Mostly consistent with minor deviations.', lower: 'Inconsistent component usage or token misuse.' } },
      { id: 'a1-accessibility', name: 'Accessibility and responsive UX', description: 'Provides semantic markup, keyboard-friendly navigation, and usable responsive layouts.', weight: 25, levels: { high: 'Full semantic markup, keyboard navigation, responsive layouts.', middle: 'Partial accessibility with minor gaps.', lower: 'Limited accessibility or non-responsive design.' } },
      { id: 'a1-deployment', name: 'Deployment and documentation', description: 'Delivers a working static deployment with a clear README and reproducible setup.', weight: 25, levels: { high: 'Live deployment, clear README, reproducible setup.', middle: 'Deployed with basic documentation.', lower: 'No deployment or unclear documentation.' } },
    ],
  },
  {
    assignmentId: 2,
    criteria: [
      { id: 'a2-audit', name: 'Audit quality', description: 'Identifies design-system strengths and issues with specific, evidence-based findings.', weight: 30, levels: { high: 'Comprehensive audit with specific evidence and examples.', middle: 'Adequate audit with some evidence.', lower: 'Superficial audit lacking evidence.' } },
      { id: 'a2-rationale', name: 'Design rationale', description: 'Connects redesign decisions to Starwind patterns, semantic tokens, and user needs.', weight: 25, levels: { high: 'Clear rationale linking decisions to patterns and user needs.', middle: 'Partial rationale with some justification.', lower: 'Weak or missing rationale.' } },
      { id: 'a2-mockup', name: 'Mockup quality', description: 'Produces clear, consistent mockups that address the audit findings.', weight: 25, levels: { high: 'Clear, consistent mockups addressing all findings.', middle: 'Mockups address most findings with minor issues.', lower: 'Unclear or incomplete mockups.' } },
      { id: 'a2-communication', name: 'Communication', description: 'Presents the audit and redesign clearly within the time limit.', weight: 20, levels: { high: 'Clear, concise presentation within time.', middle: 'Adequate presentation with minor timing issues.', lower: 'Unclear presentation or exceeds time.' } },
    ],
  },
  {
    assignmentId: 3,
    pdfPath: 'rubrics/midterm',
    criteria: [
      { id: 'a3-functionality', name: 'Core functionality', description: 'Implements the agreed feature flow end to end, including loading, forms, and API behavior.', weight: 35, levels: { high: 'Complete feature flow with proper loading, forms, and API.', middle: 'Most features work with minor bugs.', lower: 'Incomplete feature flow or major bugs.' } },
      { id: 'a3-integration', name: 'Technical integration', description: 'Integrates data access and error handling cleanly with the application architecture.', weight: 25, levels: { high: 'Clean integration with robust error handling.', middle: 'Functional integration with minor issues.', lower: 'Poor integration or missing error handling.' } },
      { id: 'a3-workflow', name: 'Engineering workflow', description: 'Uses meaningful commits, code review, and a reliable CI pipeline.', weight: 20, levels: { high: 'Meaningful commits, code review, reliable CI.', middle: 'Basic workflow with some gaps.', lower: 'Poor workflow or no CI.' } },
      { id: 'a3-report', name: 'Milestone report', description: 'Documents decisions, trade-offs, known limitations, and each member contribution.', weight: 20, levels: { high: 'Comprehensive documentation of decisions and contributions.', middle: 'Adequate documentation with minor gaps.', lower: 'Incomplete or unclear documentation.' } },
    ],
  },
  {
    assignmentId: 4,
    criteria: [
      { id: 'a4-coverage', name: 'Audit coverage', description: 'Combines automated results with a thorough manual accessibility review.', weight: 25, levels: { high: 'Comprehensive automated and manual audit.', middle: 'Adequate coverage with minor gaps.', lower: 'Limited audit coverage.' } },
      { id: 'a4-remediation', name: 'Remediation impact', description: 'Fixes findings at their source and demonstrates improved user access.', weight: 35, levels: { high: 'Root cause fixes with demonstrated improvement.', middle: 'Partial fixes with some improvement.', lower: 'Superficial fixes or no improvement.' } },
      { id: 'a4-technology-ux', name: 'Keyboard and assistive technology UX', description: 'Verifies focus order, names, states, and keyboard interaction paths.', weight: 25, levels: { high: 'Full keyboard and AT verification.', middle: 'Partial verification with minor gaps.', lower: 'Limited verification.' } },
      { id: 'a4-evidence', name: 'Evidence and changelog', description: 'Reports before-and-after evidence and explains remaining limitations.', weight: 15, levels: { high: 'Clear evidence and honest limitations.', middle: 'Some evidence with minor gaps.', lower: 'Limited evidence or unclear limitations.' } },
    ],
  },
  {
    assignmentId: 5,
    criteria: [
      { id: 'a5-performance', name: 'Performance', description: 'Meets the defined performance budgets and demonstrates healthy Core Web Vitals.', weight: 30, levels: { high: 'Meets budgets with excellent Core Web Vitals.', middle: 'Meets most budgets with acceptable Vitals.', lower: 'Fails budgets or poor Vitals.' } },
      { id: 'a5-reliability', name: 'Reliability and test coverage', description: 'Adds meaningful unit or integration coverage for critical application behavior.', weight: 25, levels: { high: 'Comprehensive test coverage for critical paths.', middle: 'Adequate coverage with minor gaps.', lower: 'Limited or no test coverage.' } },
      { id: 'a5-production', name: 'Production readiness', description: 'Ships a stable deployment with monitoring, error handling, and release documentation.', weight: 25, levels: { high: 'Stable deployment with monitoring and docs.', middle: 'Deployed with basic monitoring.', lower: 'Unstable deployment or missing docs.' } },
      { id: 'a5-polish', name: 'Polish and collaboration', description: 'Refines the experience and shows coordinated, reviewable team delivery.', weight: 20, levels: { high: 'Polished experience with coordinated delivery.', middle: 'Adequate polish with minor issues.', lower: 'Rough experience or poor coordination.' } },
    ],
  },
  {
    assignmentId: 6,
    pdfPath: 'rubrics/final-presentation',
    criteria: [
      { id: 'a6-architecture', name: 'Architecture and trade-offs', description: 'Explains the system architecture and justifies important technical decisions.', weight: 30, levels: { high: 'Clear architecture with justified trade-offs.', middle: 'Adequate explanation with some justification.', lower: 'Unclear architecture or weak justification.' } },
      { id: 'a6-demonstration', name: 'Live demonstration', description: 'Demonstrates the deployed project reliably through a representative user flow.', weight: 30, levels: { high: 'Reliable demo with representative flow.', middle: 'Demo works with minor issues.', lower: 'Unreliable demo or incomplete flow.' } },
      { id: 'a6-communication', name: 'Communication and presentation', description: 'Communicates clearly with an organized narrative, effective visuals, and pacing.', weight: 20, levels: { high: 'Clear narrative with effective visuals and pacing.', middle: 'Adequate communication with minor issues.', lower: 'Unclear communication or poor pacing.' } },
      { id: 'a6-retrospective', name: 'Retrospective', description: 'Reflects honestly on outcomes, trade-offs, collaboration, and future improvements.', weight: 20, levels: { high: 'Honest reflection on outcomes and improvements.', middle: 'Adequate reflection with minor gaps.', lower: 'Superficial reflection.' } },
    ],
  },
];

export const rubricByAssignment: Record<number, AssignmentRubric> = Object.fromEntries(
  rubrics.map((rubric) => [rubric.assignmentId, rubric]),
);
