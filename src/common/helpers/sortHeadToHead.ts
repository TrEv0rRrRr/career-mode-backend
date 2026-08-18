import { HeadToHeadStanding } from '../types/HeadToHeadStanding.ts';

export const sortByHeadToHead = (
  standings: HeadToHeadStanding[],
): HeadToHeadStanding[] => {
  return [...standings].sort((a, b) => {
    if (a.points !== b.points) {
      return b.points - a.points;
    }

    return b.gd - a.gd;
  });
};
