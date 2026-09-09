export interface ResourceItem {
  /** Primary label, e.g. the book or tool name. Linked when `url` is set. */
  title: string;
  /** Secondary editorial line, e.g. author or format qualifier. */
  subtitle?: string;
  /** One-line annotation shown under the title block. */
  description?: string;
  /** Official external URL. When set, the title renders as a link. */
  url?: string;
}

export interface ResourceGroup {
  category: string;
  items: ResourceItem[];
}

export const resources: ResourceGroup[] = [
  { category: 'Textbooks', items: [
    { title: 'Web Development with Astro', subtitle: 'Instructor-written course notes', description: 'Distributed weekly as the primary course text.' },
    { title: 'Designing Data-Intensive Applications', subtitle: 'Martin Kleppmann, O\'Reilly', description: 'Reference text for system architecture trade-offs.', url: 'https://dataintensive.net/' },
  ]},
  { category: 'Tools', items: [
    { title: 'Astro documentation', subtitle: 'docs.astro.build', description: 'Primary framework reference for labs and the team project.', url: 'https://docs.astro.build/' },
    { title: 'Starwind UI', subtitle: 'starwind.dev', description: 'Component library used for all UI work in this course.', url: 'https://starwind.dev/' },
    { title: 'Node.js LTS', subtitle: 'nodejs.org', description: 'Runtime for local development.', url: 'https://nodejs.org/' },
  ]},
];
