import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Match,
  MatchFinishType,
  MatchLeg,
  MatchStatus,
  MatchType,
} from '@prisma/client';
import { getNextKnockoutRounds } from '../common/helpers/knockouts/getNextKnockoutRounds.ts';
import { inferFirstKnockoutRound } from '../common/helpers/knockouts/inferFirstKnockoutRound.ts';
import { isKnockoutMatch } from '../common/helpers/knockouts/isKnockoutMatch.ts';
import { resolveKnockoutLosers } from '../common/helpers/knockouts/resolveKnockoutLosers.ts';
import { resolveKnockoutWinners } from '../common/helpers/knockouts/resolveKnockoutWinners.ts';
import { CompetitionEditionQueryService } from '../competitions/services/competition-edition-query.service.ts';
import { KnockoutRoundService } from '../knockout-round/knockout-round.service.ts';
import { PlayersService } from '../players/players.service.ts';
import { StadiumsService } from '../stadiums/stadiums.service.ts';
import { TeamsService } from '../teams/teams.service.ts';
import { ChangeMatchStadiumDTO } from './dto/change-match-stadium.dto.ts';
import { CreateMatchWithTieKeyDto } from './dto/create-match-with-tieKey.dto.ts';
import { CreateMatchDto } from './dto/create-match.dto.ts';
import { PlayMatchDto } from './dto/play-match.dto.ts';
import { CreateMatchPlayerStatsDto } from './dto/stats/create-match-player-stats.dto.ts';
import { CreateMatchTeamStatsDto } from './dto/stats/create-match-team-stats.dto.ts';
import { UpdateMatchDto } from './dto/update-match.dto.ts';
import { MatchNotFoundException } from './exceptions/match-not-found.exception.ts';
import { MatchesRepository } from './matches.repository.ts';

@Injectable()
export class MatchesService {
  constructor(
    private repo: MatchesRepository,
    private playersService: PlayersService,
    private teamsService: TeamsService,
    private stadiumsService: StadiumsService,
    private competitionEditionQueryService: CompetitionEditionQueryService,
    private knockoutRoundService: KnockoutRoundService,
  ) {}

  // main methods
  async findMatch(matchId: number) {
    const match = await this.repo.findOne(matchId);

    if (!match) throw new MatchNotFoundException();

    return match;
  }

  async findMatchesByRound(competitionEditionId: number, matchType: MatchType) {
    await this.competitionEditionQueryService.findCompetitionEditionById(
      competitionEditionId,
    );
    return this.repo.findMatchesByRound(competitionEditionId, matchType);
  }

  async changeStadium(matchId: number, data: ChangeMatchStadiumDTO) {
    await this.findMatch(matchId);
    await this.stadiumsService.findStadiumById(data.stadiumId);

    return this.repo.changeStadium(matchId, data);
  }

  async createManyMatches(
    competitionEditionId: number,
    data: CreateMatchWithTieKeyDto[],
  ) {
    const edition =
      await this.competitionEditionQueryService.findCompetitionEditionById(
        competitionEditionId,
      );

    const type = inferFirstKnockoutRound(edition.competition);

    this.validateTieKeys(type, data, edition.competition.hasTwoLeggedKnockout);

    return this.repo.createMany(competitionEditionId, type, data);
  }

  async countMatchesByCompetitionEdition(competitionEditionId: number) {
    await this.competitionEditionQueryService.findCompetitionEditionById(
      competitionEditionId,
    );

    return this.repo.countByCompetitionEdition(competitionEditionId);
  }

  async createMatch(competitionEditionId: number, data: CreateMatchDto) {
    await this.teamsService.findTeamById(
      data.homeTeamId,
      "The home team doesn't exist",
    );
    await this.teamsService.findTeamById(
      data.awayTeamId,
      "The away team doesn't exist",
    );

    await this.competitionEditionQueryService.findCompetitionParticipant(
      competitionEditionId,
      data.homeTeamId,
      "The home team doesn't participate in the given competition",
    );

    await this.competitionEditionQueryService.findCompetitionParticipant(
      competitionEditionId,
      data.awayTeamId,
      "The away team doesn't participate in the given competition",
    );

    await this.stadiumsService.findStadiumById(data.stadiumId);

    const edition =
      await this.competitionEditionQueryService.findCompetitionEditionById(
        competitionEditionId,
      );

    if (edition.competition.hasTwoLeggedKnockout && !data.leg)
      throw new BadRequestException(
        'Since the competition has a two legged knockout, you have to enter the match leg',
      );

    if (data.homeTeamId === data.awayTeamId)
      throw new BadRequestException('The teams must be different');

    const type = inferFirstKnockoutRound(edition.competition);

    return this.repo.create(competitionEditionId, type, data);
  }

  async validateMatchPlayerStats(
    homeTeamId: number,
    awayTeamId: number,
    matchResult: UpdateMatchDto,
    playerStats: CreateMatchPlayerStatsDto[],
  ) {
    const playerIds = playerStats.map(({ playerId }) => playerId);

    if (new Set(playerIds).size !== playerIds.length) {
      throw new BadRequestException(
        'A player cannot have multiple stat records for the same match.',
      );
    }

    const playersTeams = await this.playersService.findCurrentTeams(playerIds);

    let homePlayerGoals = 0;
    let awayPlayerGoals = 0;

    for (const stats of playerStats) {
      const teamId = playersTeams.get(stats.playerId);

      if (teamId === homeTeamId) {
        homePlayerGoals += stats.goals;
      } else if (teamId === awayTeamId) {
        awayPlayerGoals += stats.goals;
      } else {
        throw new BadRequestException(
          "There's a player whose team didn't play this match.",
        );
      }
    }

    if (homePlayerGoals > matchResult.homeGoals)
      throw new BadRequestException(
        "Home players can't score more goals than the home team.",
      );

    if (awayPlayerGoals > matchResult.awayGoals)
      throw new BadRequestException(
        "Away players can't score more goals than the away team.",
      );
  }

  async playMatch(matchId: number, data: PlayMatchDto) {
    const match = await this.findMatch(matchId);
    const competitionEdition =
      await this.competitionEditionQueryService.findCompetitionEditionById(
        match.competitionEditionId,
      );
    const playerIds = data.playerStats.map(({ playerId }) => playerId);

    const playerTeamsIds =
      await this.playersService.findCurrentTeams(playerIds);

    if (match.status === MatchStatus.PLAYED)
      throw new BadRequestException('This match has already been played');

    this.validateMatchResult(data.match);
    this.validateMatchTeamStats(data.teamStats, match);
    await this.validateMatchPlayerStats(
      match.homeTeamId,
      match.awayTeamId,
      data.match,
      data.playerStats,
    );

    const winnerTeamId = this.getWinnerTeamId(match, data.match);

    const playedMatch = await this.repo.playMatch(
      matchId,
      competitionEdition.competition.format,
      playerTeamsIds,
      competitionEdition.seasonId,
      winnerTeamId,
      data,
    );

    if (isKnockoutMatch(match.type)) {
      await this.resolveKnockoutRound(competitionEdition.id, match.type);
    }

    return playedMatch;
  }

  async findKnockoutRoundMatches(
    competitionEditionId: number,
    type: MatchType,
  ) {
    return this.repo.findMatchesByRound(competitionEditionId, type);
  }

  async resolveKnockoutRound(
    competitionEditionId: number,
    matchType: MatchType,
  ) {
    const matches = await this.repo.findMatchesByRound(
      competitionEditionId,
      matchType,
    );

    if (!matches.length) {
      throw new Error('No knockout matches found for this round.');
    }

    const allPlayed = matches.every(
      ({ status }) => status === MatchStatus.PLAYED,
    );

    if (!allPlayed) {
      return;
    }

    const edition =
      await this.competitionEditionQueryService.findCompetitionEditionById(
        competitionEditionId,
      );

    if (!edition?.competition) {
      throw new Error('Competition edition has no competition.');
    }

    const winners = resolveKnockoutWinners(edition, matches);

    const nextRounds = getNextKnockoutRounds(
      matchType,
      edition.competition.hasThirdPlaceMatch,
    );

    const currentRound =
      await this.knockoutRoundService.findKnockoutRoundByTypeAndCompetitionId(
        competitionEditionId,
        matchType,
      );

    if (!currentRound) {
      throw new Error('Knockout round not found.');
    }

    await this.knockoutRoundService.completeKnockoutRound(currentRound.id);

    if (!nextRounds.length) {
      return;
    }

    const losers =
      matchType === MatchType.SEMI_FINAL
        ? resolveKnockoutLosers(edition, matches)
        : [];

    const roundsToCreate = nextRounds.map((nextRound) => ({
      type: nextRound,
      qualifiedTeamIds: nextRound === MatchType.THIRD_PLACE ? losers : winners,
    }));

    await this.knockoutRoundService.resolveRoundAndCreateNextRounds(
      currentRound.id,
      roundsToCreate,
    );
  }

  // private methods (helpers)

  private validateMatchResult(match: UpdateMatchDto) {
    const matchFinishType = match.finishType;

    switch (matchFinishType) {
      case MatchFinishType.PENALTIES:
        if (match.homeGoals !== match.awayGoals)
          throw new BadRequestException(
            'If the match reached the penalties, you should enter a tied score',
          );
        if (!match.homePenaltyGoals || !match.awayPenaltyGoals)
          throw new BadRequestException(
            'If the match reached the penalties, you should enter the penalty score for both home and away team',
          );
        if (match.homePenaltyGoals === match.awayPenaltyGoals)
          throw new BadRequestException("The penalties can't end in a tie");
        break;
      case MatchFinishType.REGULAR_TIME:
      case MatchFinishType.EXTRA_TIME:
        if (match.homePenaltyGoals || match.awayPenaltyGoals)
          throw new BadRequestException(
            "If the match didn't reached the penalties, you shouldn't enter them",
          );
        break;
    }
  }

  private validateMatchTeamStats(
    teamStats: CreateMatchTeamStatsDto[],
    match: Match,
  ) {
    if (teamStats.length !== 2)
      throw new BadRequestException(
        'The list of teams must contain only 2 teams',
      );

    const teamIds = teamStats.map(({ teamId }) => teamId);

    if (new Set(teamIds).size !== teamIds.length) {
      throw new BadRequestException(
        'A team cannot have multiple stat records for the same match.',
      );
    }

    const homeTeamStats = teamStats.find(
      ({ teamId }) => teamId === match.homeTeamId,
    );

    const awayTeamStats = teamStats.find(
      ({ teamId }) => teamId === match.awayTeamId,
    );

    if (!homeTeamStats || !awayTeamStats)
      throw new BadRequestException(
        "One of the teams whose stats you are trying to create didn't play this match.",
      );

    if (homeTeamStats.possession + awayTeamStats.possession !== 100)
      throw new BadRequestException(
        'The total team possession must be exactly 100%.',
      );

    for (const team of teamStats) {
      if (team.shotsOnTarget > team.shots)
        throw new BadRequestException(
          "The total number of shots on target can't be greater than the total number of shots.",
        );
    }
  }

  private getWinnerTeamId(match: Match, data: UpdateMatchDto) {
    if (data.homeGoals > data.awayGoals) return match.homeTeamId;
    else if (data.awayGoals > data.homeGoals) return match.awayTeamId;
    else if (match.finishType === MatchFinishType.PENALTIES)
      return data.homePenaltyGoals! > data.awayPenaltyGoals!
        ? match.homeTeamId
        : match.awayTeamId;
    else return null;
  }

  private validateTieKeys(
    type: MatchType,
    data: CreateMatchWithTieKeyDto[],
    hasTwoLeggedKnockout: boolean,
  ) {
    if (!isKnockoutMatch(type)) return;

    const isTwoLegged =
      hasTwoLeggedKnockout &&
      type !== MatchType.FINAL &&
      type !== MatchType.THIRD_PLACE;

    const ties = new Map<string, CreateMatchWithTieKeyDto[]>();

    for (const match of data) {
      const key = match.tieKey?.trim();

      if (!key) {
        throw new BadRequestException(
          'Every knockout match must have a tieKey.',
        );
      }

      const matches = ties.get(key) ?? [];
      matches.push(match);
      ties.set(key, matches);
    }

    for (const [key, matches] of ties) {
      if (!isTwoLegged) {
        if (matches.length !== 1 || matches[0].leg != null) {
          throw new BadRequestException(
            `Tie "${key}" must contain exactly one match without a leg.`,
          );
        }

        continue;
      }

      if (
        matches.length !== 2 ||
        matches.filter((match) => match.leg === MatchLeg.FIRST).length !== 1 ||
        matches.filter((match) => match.leg === MatchLeg.SECOND).length !== 1
      ) {
        throw new BadRequestException(
          `Tie "${key}" must contain one FIRST match and one SECOND match.`,
        );
      }

      const [first, second] = matches;

      if (
        first.homeTeamId !== second.awayTeamId ||
        first.awayTeamId !== second.homeTeamId
      ) {
        throw new BadRequestException(
          `Tie "${key}" must have reversed teams in the second leg.`,
        );
      }
    }
  }
}
