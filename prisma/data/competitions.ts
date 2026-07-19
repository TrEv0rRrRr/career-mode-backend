import { CompetitionType } from '@prisma/client';

export const competitions = [
  {
    name: 'Bundesliga',
    type: CompetitionType.LEAGUE,
    logo: '/images/competitions/bundesliga.png',
  },
  {
    name: 'LaLiga',
    type: CompetitionType.LEAGUE,
    logo: '/images/competitions/la-liga.png',
  },
  {
    name: 'Premier League',
    type: CompetitionType.LEAGUE,
    logo: '/images/competitions/premier-league.png',
  },
  {
    name: 'Serie A',
    type: CompetitionType.LEAGUE,
    logo: '/images/competitions/serie-a.png',
  },
  {
    name: 'Ligue 1',
    type: CompetitionType.LEAGUE,
    logo: '/images/competitions/ligue-1.png',
  },
  {
    name: 'DFB-Pokal',
    type: CompetitionType.CUP,
    logo: '/images/competitions/dfb-pokal.png',
  },
  {
    name: 'Copa Del Rey',
    type: CompetitionType.CUP,
    logo: '/images/competitions/copa-del-rey.png',
  },
  {
    name: 'FA Cup',
    type: CompetitionType.CUP,
    logo: '/images/competitions/fa-cup.png',
  },
  {
    name: 'Coppa Italia',
    type: CompetitionType.CUP,
    logo: '/images/competitions/coppa-italia.png',
  },
  {
    name: 'Coupe de France',
    type: CompetitionType.CUP,
    logo: '/images/competitions/coupe-de-france.png',
  },
  {
    name: 'DFL-Supercup',
    type: CompetitionType.SUPER_CUP,
    logo: '/images/competitions/dfl-supercup.png',
  },
  {
    name: 'Supercopa De España',
    type: CompetitionType.SUPER_CUP,
    logo: '/images/competitions/supercopa-espana.png',
  },
  {
    name: 'The FA Community Shield',
    type: CompetitionType.SUPER_CUP,
    logo: '/images/competitions/community-shield.png',
  },
  {
    name: 'Supercoppa Italiana',
    type: CompetitionType.SUPER_CUP,
    logo: '/images/competitions/supercoppa-italia.png',
  },
  {
    name: 'Trophée Des Champions',
    type: CompetitionType.SUPER_CUP,
    logo: '/images/competitions/supercopa-francia.png',
  },
  {
    name: 'UEFA Champions League',
    type: CompetitionType.INTERNATIONAL,
    logo: '/images/competitions/ucl.png',
  },
  {
    name: 'UEFA Europa League',
    type: CompetitionType.INTERNATIONAL,
    logo: '/images/competitions/uel.png',
  },
  {
    name: 'UEFA Super Cup',
    type: CompetitionType.INTERNATIONAL,
    logo: '/images/competitions/usc.png',
  },
  {
    name: 'FIFA Club World Cup',
    type: CompetitionType.INTERNATIONAL,
    logo: '/images/competitions/fifa-club-world-cup.png',
  },
  {
    name: 'Copa CONMEBOL Libertadores',
    type: CompetitionType.INTERNATIONAL,
    logo: '/images/competitions/libertadores.png',
  },
];
