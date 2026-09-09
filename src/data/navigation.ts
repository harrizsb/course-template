export interface NavItem {
  href: string;
  label: string;
  /** One-line summary used by the home page section index. */
  description: string;
}

export const navItems: NavItem[] = [
  { href: '/', label: 'Home', description: 'Course overview, instructor, and prerequisites.' },
  { href: '/syllabus', label: 'Syllabus', description: 'Policies, grading scheme, and course expectations.' },
  { href: '/schedule', label: 'Schedule', description: 'Weekly topics, readings, and lecture materials.' },
  { href: '/assignments', label: 'Assignments', description: 'Homework, milestones, and the team project.' },
  { href: '/resources', label: 'Resources', description: 'Textbooks, tools, and reference material.' },
];
