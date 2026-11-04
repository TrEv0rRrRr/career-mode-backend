import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  CompetitionEdition,
  CompetitionFormat,
  MatchType,
} from '@prisma/client';
import { calendarTemplates } from '../../common/calendar/calendarTemplates.ts';
import { generateKnockoutBracket } from '../../common/fixtures/groups-knockout/generate-bracket.fixture.ts';
import { generateGroupFixture } from '../../common/fixtures/groups-knockout/generate-group.fixture.ts';
import { generateLeagueFixture } from '../../common/fixtures/league/league-20.fixture.ts';
import { generateSuperCupPairing } from '../../common/fixtures/super-cup.fixture.ts';
import { inferFirstKnockoutRound } from '../../common/helpers/knockouts/inferFirstKnockoutRound.ts';
import { CalendarEntry } from '../../common/types/CalendarEntry.ts';
import { MatchPairing } from '../../common/types/MatchPairing.ts';
import { ParticipatingTeam } from '../../common/types/ParticipatingTeams.ts';
import { CreatePairingDto } from '../../knockout-round/dto/create-knockout-pairing.dto.ts';
import { KnockoutRoundWithRelations } from '../../knockout-round/knockout-round.repository.ts';
import { CreateMatchDto } from '../../matches/dto/create-match.dto.ts';
import { MatchesService } from '../../matches/matches.service.ts';
import { SeasonsService } from '../../seasons/seasons.service.ts';
import { CompetitionsService } from '../competitions.service.ts';

@Injectable()
export class CompetitionFixtureService {
  constructor(
    private readonly competitionsService: CompetitionsService,
    @Inject(forwardRef(() => MatchesService))
    private readonly matchesService: MatchesService,
    private readonly seasonService: SeasonsService,
  ) {}
  private findCalendarEntry(calendar: CalendarEntry[], match: MatchPairing) {
    return calendar.find((entry) => {
      if (match.matchday !== undefined) {
        return entry.matchday === match.matchday;
      }

      if (match.leg !== undefined) {
        return entry.matchType === match.matchType && entry.leg === match.leg;
      }

      return entry.matchType === match.matchType;
    });
  }

  private mergeFixtureWithCalendar(
    fixture: MatchPairing[],
    calendar: CalendarEntry[],
    participantTeams: ParticipatingTeam[],
    competitionEdition: CompetitionEdition,
  ) {
    const matches: CreateMatchDto[] = [];

    const teamsMap = new Map(participantTeams.map((t) => [t.team.id, t.team]));

    for (const match of fixture) {
      const day = this.findCalendarEntry(calendar, match);

      if (!day)
        throw new BadRequestException(
          `No calendar entry found for ${match.matchType} ${match.leg ?? ''}`,
        );

      const homeTeam = teamsMap.get(match.homeTeamId);

      if (!homeTeam)
        throw new BadRequestException(
          `Team ${match.homeTeamId} was not found among competition participants`,
        );

      matches.push({
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
        date: day.date,
        stadiumId:
          match.matchType === MatchType.FINAL &&
          competitionEdition.finalStadiumId
            ? competitionEdition.finalStadiumId
            : homeTeam.stadiumId,
        matchday: day.matchday,
        leg: match.leg,
      });
    }

    return matches;
  }

  async generateCompetitionFixture(
    competitionEditionId: number,
    competitionId: number,
  ) {
    const competition =
      await this.competitionsService.findCompetitionById(competitionId);

    const competitionEdition =
      await this.competitionsService.findCompetitionEditionById(
        competitionEditionId,
      );

    const season = await this.seasonService.findSeasonById(
      competitionEdition.seasonId,
    );

    const [year1, year2] = season.code.split('/');

    const participantTeams =
      await this.competitionsService.findCompetitionParticipants(
        competitionEditionId,
      );

    if (participantTeams.length <= 1)
      throw new BadRequestException(
        'To generate a fixture, you have to register at least 2 teams in a competition',
      );

    const existingMatches =
      await this.matchesService.countMatchesByCompetitionEdition(
        competitionEditionId,
      );

    if (existingMatches > 0)
      throw new BadRequestException(
        'The fixture has already been generated for this competition edition.',
      );

    let fixture: MatchPairing[];
    const matchType = inferFirstKnockoutRound(competition);

    switch (competition.format) {
      case CompetitionFormat.SUPER_CUP:
        fixture = generateSuperCupPairing(participantTeams);
        break;
      case CompetitionFormat.GROUPS_AND_KNOCKOUT:
        fixture = generateGroupFixture(participantTeams);
        break;
      case CompetitionFormat.LEAGUE:
        fixture = generateLeagueFixture(participantTeams);
        break;
      case CompetitionFormat.KNOCKOUT:
        fixture = generateKnockoutBracket(
          {
            homeTeamId: participantTeams[0].team.id,
            awayTeamId: participantTeams[1].team.id,
            matchType,
          },
          competition.hasTwoLeggedKnockout,
        );
        break;
      default:
        throw new BadRequestException('Unsupported competition format');
    }

    // Obtener el calendario correspondiente (fechas)
    const calendar = calendarTemplates[competition.name](year1, year2);

    // Combinar fixture + calendario

    const scheduledMatches = this.mergeFixtureWithCalendar(
      fixture,
      calendar,
      participantTeams,
      competitionEdition,
    );

    return this.matchesService.createManyMatches(
      competitionEdition.id,
      inferFirstKnockoutRound(competition),
      scheduledMatches,
    );
  }

  async generateKnockoutRoundMatches(
    knockoutRound: KnockoutRoundWithRelations,
    pairings: CreatePairingDto[],
  ) {
    const competitionEdition =
      await this.competitionsService.findCompetitionEditionById(
        knockoutRound.competitionEditionId,
      );

    const competition = competitionEdition.competition;

    const hasTwoLeggedKnockout = competition.hasTwoLeggedKnockout;

    const season = await this.seasonService.findSeasonById(
      competitionEdition.seasonId,
    );

    const [year1, year2] = season.code.split('/');

    const calendarGenerator = calendarTemplates[competition.name];

    if (!calendarGenerator) {
      throw new BadRequestException(
        `No calendar template found for ${competition.name}`,
      );
    }

    const calendar = calendarGenerator(year1, year2);

    const participantTeams: ParticipatingTeam[] =
      knockoutRound.qualifiedTeams.map(({ team }) => ({
        team,
        position: null,
      }));

    const matchesByPairing = pairings.map((pairing) => {
      const fixture = generateKnockoutBracket(
        {
          ...pairing,
          matchType: knockoutRound.type,
        },
        hasTwoLeggedKnockout,
      );

      return this.mergeFixtureWithCalendar(
        fixture,
        calendar,
        participantTeams,
        competitionEdition,
      );
    });

    return this.matchesService.createKnockoutRoundMatches(
      knockoutRound.id,
      competitionEdition.id,
      knockoutRound.type,
      matchesByPairing,
    );
  }
}
