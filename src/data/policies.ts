export interface Policy {
  title: string;
  body: string[];
}

/** Course policies rendered by the syllabus page. */
export const policies: Policy[] = [
  {
    title: 'Attendance Policy',
    body: [
      'Regular attendance is expected and contributes to participation grade.',
      'Missing more than 3 lectures without prior notice will result in a reduction of your participation grade.',
      'If you know you will be absent, notify the instructor in advance when possible.',
      'Lecture recordings are available for enrolled students via the course portal.',
    ],
  },
  {
    title: 'Late Work Policy',
    body: [
      'Each assignment has a 3-day grace period — no penalty within this window.',
      'After the grace period, assignments lose 10% of their total points per calendar day.',
      'No assignment is accepted more than 7 days past the original due date.',
      'Extensions require prior approval; emergencies are handled case-by-case.',
    ],
  },
  {
    title: 'Academic Integrity',
    body: [
      'All work must be your own or properly attributed. Plagiarism results in zero.',
      'Code shared between team members on individual assignments is considered plagiarism.',
      'Open-source code used must be clearly cited with source links in a README or comments.',
      'Using AI-generated code without attribution violates the university honor code.',
      'Violations will be reported to the department and may result in course failure.',
    ],
  },
  {
    title: 'Collaboration & Teamwork',
    body: [
      'Teams of 3-4 students will be formed during the first two weeks of class.',
      'Each team must hold weekly standup meetings and maintain a shared project board.',
      'Peer evaluations are conducted at midterm and final project stages.',
      'Conflict resolution should involve the instructor if teams cannot self-resolve.',
    ],
  },
  {
    title: 'Accessibility & Accommodations',
    body: [
      'Students with disabilities should contact Accessibility Services for accommodations.',
      'All course materials will be provided in accessible formats upon request.',
      'Please inform the instructor of any needs that would support your learning.',
      'The course website follows WCAG 2.1 AA standards.',
    ],
  },
];
