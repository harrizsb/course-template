import { assignments } from './assignments';

export interface Mission {
  id: string;
  assignmentId: number;
  title: string;
  description: string;
  xp: number;
  badgeId: string;
}

export interface Level {
  level: number;
  name: string;
  xpRequired: number;
}

export interface GamificationBadge {
  id: string;
  name: string;
  description: string;
  assignmentId: number;
}

const badgeNames = ['Portfolio Scout', 'Design Cartographer', 'Core Loop Keeper', 'A11y Guardian', 'Performance Runner', 'Launch Storyteller'];
const levelNames = ['New Recruit', 'System Builder', 'Team Shipper', 'Web Architect', 'Edge Master'];

/** One static mission and badge per course assignment. */
export const missions: Mission[] = assignments.map((assignment, index) => ({
  id: `mission-${assignment.id}`,
  assignmentId: assignment.id,
  title: assignment.title,
  description: assignment.description,
  xp: (index + 1) * 50 + 50,
  badgeId: `badge-${assignment.id}`,
}));

export const badges: GamificationBadge[] = assignments.map((assignment, index) => ({
  id: `badge-${assignment.id}`,
  name: badgeNames[index] ?? `Mission ${assignment.id} Badge`,
  description: `Complete assignment ${assignment.id}: ${assignment.title}.`,
  assignmentId: assignment.id,
}));

export const totalMissionXp = missions.reduce((total, mission) => total + mission.xp, 0);

export const levels: Level[] = levelNames.map((name, index) => ({
  level: index + 1,
  name,
  xpRequired: index === 0 ? 0 : missions.slice(0, index).reduce((total, mission) => total + mission.xp, 0),
}));

export function getLevelForXp(xp: number): Level {
  return levels.reduce((current, level) => (level.xpRequired <= xp ? level : current), levels[0]);
}
