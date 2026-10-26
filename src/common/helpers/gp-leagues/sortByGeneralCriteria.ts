import { HeadToHeadStanding } from '../types/HeadToHeadStanding.ts';

export const sortByPoints = (teams: HeadToHeadStanding[]) =>
  [...teams].sort((a, b) => b.points - a.points);

export const sortByGoalDifference = (teams: HeadToHeadStanding[]) =>
  [...teams].sort((a, b) => b.gd - a.gd);
