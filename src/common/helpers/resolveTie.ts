import { Match } from '@prisma/client';
import { HeadToHeadStanding } from '../types/HeadToHeadStanding.ts';
import { buildHeadToHeadTable } from './buildHeadToHeadTable.ts';
import { sortByHeadToHead } from './sortHeadToHead.ts';

export const resolveTie = (matches: Match[]): HeadToHeadStanding[] => {
  const headToHeadTable = buildHeadToHeadTable(matches);

  return sortByHeadToHead(headToHeadTable);
};
