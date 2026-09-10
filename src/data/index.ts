/**
 * Single aggregation point for course data consumers.
 * Pages import from here, never from individual data modules,
 * so the underlying module layout can change without touching pages.
 */
export { course, courseMeta, grading, prerequisites } from './course';
export type { Course, Instructor, Grading } from './course';
export { weeks } from './schedule';
export type { Week } from './schedule';
export { assignments } from './assignments';
export type { Assignment } from './assignments';
export { resources } from './resources';
export type { ResourceGroup, ResourceItem } from './resources';
export { navItems } from './navigation';
export type { NavItem } from './navigation';
export { policies } from './policies';
export type { Policy } from './policies';
export { materials, materialByPath, materialByFile } from './materials.generated';
export type { MaterialAsset } from './materials.generated';
export { missions, levels, badges, totalMissionXp, getLevelForXp } from './gamification';
export type { Mission, Level, GamificationBadge } from './gamification';
export { rubrics, rubricByAssignment } from './rubrics';
export type { AssignmentRubric, RubricCriterion } from './rubrics';
export { brandColors } from './theme';
export type { BrandColors } from './theme';
