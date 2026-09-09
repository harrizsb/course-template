export interface Instructor {
  name: string;
  email: string;
  office: string;
  officeHours: string;
}

export interface Course {
  code: string;
  title: string;
  term: string;
  description: string;
  instructor: Instructor;
  location: string;
  schedule: string;
  /** Footer freshness line, e.g. "September 2026". */
  lastUpdated: string;
}

export interface Grading {
  participation: number;
  assignments: number;
  midterm: number;
  final: number;
}

export const course: Course = {
  code: 'CS 499',
  title: 'Advanced Web Systems',
  term: 'Fall 2026',
  description: 'A project-driven examination of modern web system architecture: rendering strategies, state management, API design, accessibility, performance, and deployment pipelines. Students design, build, and ship a production-grade web application in teams, applying industry tooling and design systems throughout.',
  instructor: {
    name: 'Dr. Elena Vasquez',
    email: 'e.vasquez@university.edu',
    office: 'Room 412, Engineering Hall',
    officeHours: 'Tue/Thu 14:00-16:00',
  },
  location: 'Room 301, Engineering Hall',
  schedule: 'MWF 10:00-10:50',
  lastUpdated: 'September 2026',
};

export const grading: Grading = {
  participation: 10,
  assignments: 60,
  midterm: 15,
  final: 15,
};

export const prerequisites: string[] = [
  'CS 201 - Data Structures',
  'CS 310 - Databases',
  'CS 330 - Networks',
];

/** Standard PageHeader meta line: "CS 499 · Fall 2026 · Dr. Elena Vasquez". */
export const courseMeta = `${course.code} · ${course.term} · ${course.instructor.name}`;
