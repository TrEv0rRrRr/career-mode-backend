import { CalendarEntry } from '../types/CalendarEntry.ts';
import { getClubWorldCupCalendar } from './calendarTemplates/club-world-cup.calendar.ts';
import { getCopaGruposTestCalendar } from './calendarTemplates/copa-grupos-test-calendar.ts';
import { getCopaTestCalendar } from './calendarTemplates/copa-test.calendar.ts';
import { getCupCalendar } from './calendarTemplates/cup.calendar.ts';
import { getLeagueCalendar } from './calendarTemplates/league.calendar.ts';
import { getNationalSuperCupsCalendar } from './calendarTemplates/super-cups.calendar.ts';
import { getChampionsLeagueCalendar } from './calendarTemplates/ucl.calendar.ts';
import { getEuropaLeagueCalendar } from './calendarTemplates/uel.calendar.ts';
import { getSuperCupCalendar } from './calendarTemplates/usc.calendar.ts';

type CalendarGenerator = (year1: string, year2: string) => CalendarEntry[];

export const calendarTemplates: Record<string, CalendarGenerator> = {
  Bundesliga: getLeagueCalendar,
  LaLiga: getLeagueCalendar,
  'Premier League': getLeagueCalendar,
  'Serie A': getLeagueCalendar,
  'Ligue 1': getLeagueCalendar,

  'DFB-Pokal': getCupCalendar,
  'FA Cup': getCupCalendar,
  'Coppa Italia': getCupCalendar,
  'Coupe de France': getCupCalendar,
  'Copa Del Rey': getCupCalendar,

  'UEFA Champions League': getChampionsLeagueCalendar,
  'UEFA Europa League': getEuropaLeagueCalendar,

  'UEFA Super Cup': getSuperCupCalendar,

  'FIFA Club World Cup': getClubWorldCupCalendar,

  'DFL-Supercup': getNationalSuperCupsCalendar,
  'Supercopa De España': getNationalSuperCupsCalendar,
  'The FA Community Shield': getNationalSuperCupsCalendar,
  'Supercoppa Italiana': getNationalSuperCupsCalendar,
  'Trophée Des Champions': getNationalSuperCupsCalendar,
  'Copa Test': getCopaTestCalendar,
  'Copa Grupos Test': getCopaGruposTestCalendar,
  'Liga Test': getLeagueCalendar,
};
