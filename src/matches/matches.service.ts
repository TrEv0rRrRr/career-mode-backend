import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  CompetitionType,
  CompetitionFormat,
  Match,
  MatchFinishType,
  MatchLeg,
  MatchStatus,
  MatchType,
} from '@prisma/client';
import { ClubsService } from '../clubs/clubs.service.ts';
import { ClubSummary } from '../clubs/dto/response/club-response.dto.ts';
import { getNextKnockoutRounds } from '../common/helpers/knockouts/getNextKnockoutRounds.ts';
import { inferFirstKnockoutRound } from '../common/helpers/knockouts/inferFirstKnockoutRound.ts';
import { isKnockoutMatch } from '../common/helpers/knockouts/isKnockoutMatch.ts';
import { isTwoLeggedKnockoutRound } from '../common/helpers/knockouts/isTwoLeggedKnockoutRound.ts';
import { resolveKnockoutLosers } from '../common/helpers/knockouts/resolveKnockoutLosers.ts';
import { resolveKnockoutWinners } from '../common/helpers/knockouts/resolveKnockoutWinners.ts';
import { transformMatchTypeToKnockoutRoundType } from '../common/helpers/transformKnockoutRoundTypeToMatchType.ts';
import { CompetitionEditionQueryService } from '../competitions/services/competition-edition-query.service.ts';
import { KnockoutRoundService } from '../knockout-round/knockout-round.service.ts';
import { PlayersService } from '../players/players.service.ts';
import { StadiumsService } from '../stadiums/stadiums.service.ts';
import { ChangeMatchStadiumDTO } from './dto/change-match-stadium.dto.ts';
import { CreateMatchDto } from './dto/create-match.dto.ts';
import { MatchMapper } from './dto/mapper/match.mapper.ts';
import { PlayMatchDto } from './dto/play-match.dto.ts';
import { MatchResponseDto } from './dto/response/match-response.dto.ts';
import { CreateMatchClubStatsDto } from './dto/stats/create-match-club-stats.dto.ts';
import { CreateMatchPlayerStatsDto } from './dto/stats/create-match-player-stats.dto.ts';
import { UpdateMatchDto } from './dto/update-match.dto.ts';
import { MatchNotFoundException } from './exceptions/match-not-found.exception.ts';
import { MatchesRepository } from './matches.repository.ts';

type ClubMatchResponse = MatchResponseDto & {
  homeClub: ClubSummary;
  awayClub: ClubSummary;
};

@Injectable()
export class MatchesService {
  constructor(
    private repo: MatchesRepository,
    private playersService: PlayersService,
    private clubsService: ClubsService,
    private stadiumsService: StadiumsService,
    private competitionEditionQueryService: CompetitionEditionQueryService,
    @Inject(forwardRef(() => KnockoutRoundService))
    private knockoutRoundService: KnockoutRoundService,
  ) {}

  // main methods
  async findMatch(matchId: number) {
    const match = await this.repo.findOne(matchId);

    if (!match) throw new MatchNotFoundException();

    return MatchMapper.toResponse(match);
  }

  async findMatchesByRound(competitionEditionId: number, matchType: MatchType) {
    await this.competitionEditionQueryService.findCompetitionEditionById(
      competitionEditionId,
    );
    return this.repo.findMatchesByRound(competitionEditionId, matchType);
  }

  async findMatchesByTieId(tieId: number) {
    const matches = await this.repo.findMatchesByTieId(tieId);

    if (!matches) throw new MatchNotFoundException();

    return MatchMapper.toResponseWithTie(matches);
  }

  async changeStadium(matchId: number, data: ChangeMatchStadiumDTO) {
    await this.findMatch(matchId);
    await this.stadiumsService.findStadiumById(data.stadiumId);

    return this.repo.changeStadium(matchId, data);
  }

  async createManyMatches(
    competitionEditionId: number,
    type: MatchType,
    data: CreateMatchDto[],
  ) {
    await this.competitionEditionQueryService.findCompetitionEditionById(
      competitionEditionId,
    );

    return this.repo.createMany(competitionEditionId, type, data);
  }

  async createGroupStageMatches(
    competitionEditionId: number,
    groups: Record<string, number[]>,
    matches: CreateMatchDto[],
  ) {
    await this.competitionEditionQueryService.findCompetitionEditionById(
      competitionEditionId,
    );

    return this.repo.createGroupStageMatches(
      competitionEditionId,
      groups,
      matches,
    );
  }

  async countMatchesByCompetitionEdition(competitionEditionId: number) {
    await this.competitionEditionQueryService.findCompetitionEditionById(
      competitionEditionId,
    );

    return this.repo.countByCompetitionEdition(competitionEditionId);
  }

  async createMatch(competitionEditionId: number, data: CreateMatchDto) {
    if (
      typeof data.homeClubId !== 'number' ||
      !Number.isInteger(data.homeClubId) ||
      data.homeClubId < 1 ||
      typeof data.awayClubId !== 'number' ||
      !Number.isInteger(data.awayClubId) ||
      data.awayClubId < 1 ||
      data.homeNationalTeamId !== undefined ||
      data.awayNationalTeamId !== undefined
    )
      throw new BadRequestException(
        'This endpoint only accepts homeClubId and awayClubId.',
      );

    await this.clubsService.findClubById(
      data.homeClubId,
      "The home club doesn't exist",
    );
    await this.clubsService.findClubById(
      data.awayClubId,
      "The away club doesn't exist",
    );

    await this.competitionEditionQueryService.findCompetitionParticipant(
      competitionEditionId,
      data.homeClubId,
      "The home club doesn't participate in the given competition",
    );

    await this.competitionEditionQueryService.findCompetitionParticipant(
      competitionEditionId,
      data.awayClubId,
      "The away club doesn't participate in the given competition",
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

    if (data.homeClubId === data.awayClubId)
      throw new BadRequestException('The clubs must be different');

    const type = inferFirstKnockoutRound(edition.competition);

    return this.repo.create(competitionEditionId, type, data);
  }

  async validateMatchPlayerStats(
    homeClubId: number,
    awayClubId: number,
    matchResult: UpdateMatchDto,
    playerStats: CreateMatchPlayerStatsDto[],
  ) {
    const playerIds = playerStats.map(({ playerId }) => playerId);

    if (new Set(playerIds).size !== playerIds.length) {
      throw new BadRequestException(
        'A player cannot have multiple stat records for the same match.',
      );
    }

    const playersClubs = await this.playersService.findCurrentClubs(playerIds);

    let homePlayerGoals = 0;
    let awayPlayerGoals = 0;

    for (const stats of playerStats) {
      const clubId = playersClubs.get(stats.playerId);

      if (clubId === homeClubId) {
        homePlayerGoals += stats.goals;
      } else if (clubId === awayClubId) {
        awayPlayerGoals += stats.goals;
      } else {
        throw new BadRequestException(
          "There's a player whose club didn't play this match.",
        );
      }
    }

    if (homePlayerGoals > matchResult.homeGoals)
      throw new BadRequestException(
        "Home players can't score more goals than the home club.",
      );

    if (awayPlayerGoals > matchResult.awayGoals)
      throw new BadRequestException(
        "Away players can't score more goals than the away club.",
      );
  }

  async playMatch(
    matchId: number,
    data: PlayMatchDto,
    finishType: MatchFinishType,
    tieId?: number,
  ) {
    const foundMatch = await this.findMatch(matchId);
    if (
      foundMatch.homeNationalTeamId !== null ||
      foundMatch.awayNationalTeamId !== null
    )
      return this.playNationalTeamMatch(foundMatch, data, finishType, tieId);

    const { homeClub, awayClub } = foundMatch;

    if (!homeClub || !awayClub) {
      throw new BadRequestException(
        'Player and club stats can only be recorded for club matches.',
      );
    }

    const match: ClubMatchResponse = { ...foundMatch, homeClub, awayClub };
    const playerStats = data.playerStats ?? [];
    const clubStats = data.clubStats ?? [];

    const competitionEdition =
      await this.competitionEditionQueryService.findCompetitionEditionById(
        match.competitionEditionId,
      );
    const playerIds = playerStats.map(({ playerId }) => playerId);

    const playerClubsIds =
      await this.playersService.findCurrentClubs(playerIds);

    const hasTwoLeggedKnockout =
      competitionEdition.competition.hasTwoLeggedKnockout;
    const isTwoLeggedKnockout = isTwoLeggedKnockoutRound(
      match.type,
      hasTwoLeggedKnockout,
    );
    let secondLegAggregateIsTied = false;

    if (match.status === MatchStatus.PLAYED)
      throw new BadRequestException('This match has already been played');

    if (isTwoLeggedKnockout) {
      if (!match.leg || match.tieId === null)
        throw new BadRequestException(
          'A two-legged knockout match must have a leg and a tie',
        );

      if (tieId !== undefined && tieId !== match.tieId)
        throw new BadRequestException(
          'The tieId does not belong to this match',
        );

      if (
        match.leg === MatchLeg.FIRST &&
        finishType !== MatchFinishType.REGULAR_TIME
      )
        throw new BadRequestException(
          'The first leg of a two-legged knockout must end in regular time',
        );

      if (match.leg === MatchLeg.SECOND) {
        const { matches } = await this.findMatchesByTieId(match.tieId);
        const firstLeg = this.validateLegOrder(matches);
        secondLegAggregateIsTied = this.validateTwoLeggedResult(
          firstLeg,
          match,
          data.match,
          finishType,
        );
      }
    }

    this.validateMatchResult(
      data.match,
      competitionEdition.competition.format,
      match.type,
      finishType,
      isTwoLeggedKnockout,
      secondLegAggregateIsTied,
    );
    this.validateMatchClubStats(clubStats, match);
    await this.validateMatchPlayerStats(
      match.homeClub.id,
      match.awayClub.id,
      data.match,
      playerStats,
    );

    const winnerClubId = this.getWinnerClubId(match, data.match, finishType);

    const playedMatch = await this.repo.playMatch(
      matchId,
      competitionEdition.competition.format,
      playerClubsIds,
      competitionEdition.seasonId,
      winnerClubId,
      false,
      { ...data, playerStats, clubStats },
      finishType,
    );

    if (isKnockoutMatch(match.type)) {
      await this.resolveKnockoutRound(competitionEdition.id, match.type);
    }

    return playedMatch;
  }

  private async playNationalTeamMatch(
    match: MatchResponseDto,
    data: PlayMatchDto,
    finishType: MatchFinishType,
    tieId?: number,
  ) {
    if (
      !match.homeNationalTeam ||
      !match.awayNationalTeam ||
      match.homeNationalTeamId === null ||
      match.awayNationalTeamId === null ||
      match.homeClubId !== null ||
      match.awayClubId !== null
    )
      throw new BadRequestException(
        'A national teams match must have two national teams.',
      );

    const playerStats = data.playerStats ?? [];
    const clubStats = data.clubStats ?? [];
    if (playerStats.length > 0 || clubStats.length > 0)
      throw new BadRequestException(
        'Player and club stats are not supported for national team matches.',
      );

    const edition =
      await this.competitionEditionQueryService.findCompetitionEditionById(
        match.competitionEditionId,
      );
    if (edition.competition.type !== CompetitionType.NATIONAL_TEAMS)
      throw new BadRequestException(
        'National team matches require a national teams competition.',
      );
    if (match.status === MatchStatus.PLAYED)
      throw new BadRequestException('This match has already been played');

    const isTwoLeggedKnockout = isTwoLeggedKnockoutRound(
      match.type,
      edition.competition.hasTwoLeggedKnockout,
    );
    let secondLegAggregateIsTied = false;
    if (isTwoLeggedKnockout) {
      if (!match.leg || match.tieId === null)
        throw new BadRequestException(
          'A two-legged knockout match must have a leg and a tie',
        );
      if (tieId !== undefined && tieId !== match.tieId)
        throw new BadRequestException(
          'The tieId does not belong to this match',
        );
      if (
        match.leg === MatchLeg.FIRST &&
        finishType !== MatchFinishType.REGULAR_TIME
      )
        throw new BadRequestException(
          'The first leg of a two-legged knockout must end in regular time',
        );
      if (match.leg === MatchLeg.SECOND) {
        const { matches } = await this.findMatchesByTieId(match.tieId);
        const firstLeg = this.validateLegOrder(matches);
        secondLegAggregateIsTied = this.validateTwoLeggedResult(
          firstLeg,
          match,
          data.match,
          finishType,
        );
      }
    }

    this.validateMatchResult(
      data.match,
      edition.competition.format,
      match.type,
      finishType,
      isTwoLeggedKnockout,
      secondLegAggregateIsTied,
    );
    const winnerId = this.getWinnerParticipantId(match, data.match, finishType);
    const playedMatch = await this.repo.playMatch(
      match.id,
      edition.competition.format,
      new Map(),
      edition.seasonId,
      winnerId,
      true,
      { ...data, playerStats, clubStats },
      finishType,
    );

    if (isKnockoutMatch(match.type))
      await this.resolveKnockoutRound(edition.id, match.type);

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

    if (
      matches.some(
        (match) =>
          (match.homeNationalTeamId ?? match.homeClubId) === null ||
          (match.awayNationalTeamId ?? match.awayClubId) === null,
      )
    ) {
      throw new Error('Knockout matches must have two participants.');
    }

    const edition =
      await this.competitionEditionQueryService.findCompetitionEditionById(
        competitionEditionId,
      );

    if (!edition?.competition) {
      throw new Error('Competition edition has no competition.');
    }

    const winners = resolveKnockoutWinners(edition, matches);

    const currentRound =
      await this.knockoutRoundService.findKnockoutRoundByTypeAndCompetitionEditionId(
        competitionEditionId,
        transformMatchTypeToKnockoutRoundType(matchType),
      );

    if (!currentRound) {
      throw new Error('Knockout round not found.');
    }

    if (matchType === MatchType.FINAL) {
      await this.knockoutRoundService.completeKnockoutRound(currentRound.id);

      const winnerId = winners[0];

      const finalMatch = matches[0];
      const homeId = finalMatch.homeNationalTeamId ?? finalMatch.homeClubId;
      const awayId = finalMatch.awayNationalTeamId ?? finalMatch.awayClubId;
      if (homeId === null || awayId === null)
        throw new Error('The final must have two participants.');
      const runnerUpId = winnerId === homeId ? awayId : homeId;

      await this.competitionEditionQueryService.assignWinnerAndRunnerUp(
        edition.competition.id,
        edition.id,
        edition.competition.type === CompetitionType.NATIONAL_TEAMS
          ? {
              winnerNationalTeamId: winnerId,
              runnerUpNationalTeamId: runnerUpId,
            }
          : { winnerClubId: winnerId, runnerUpClubId: runnerUpId },
      );

      return;
    }

    const losers = resolveKnockoutLosers(edition, matches);

    const nextRounds = getNextKnockoutRounds(
      matchType,
      edition.competition.hasThirdPlaceMatch,
    );
    const keepSemiFinalLosers =
      matchType === MatchType.SEMI_FINAL &&
      edition.competition.hasThirdPlaceMatch;
    const eliminatedParticipantIds = keepSemiFinalLosers ? [] : losers;

    const roundsToCreate = nextRounds.map((nextRound) => ({
      type: nextRound,
      ...(edition.competition.type === CompetitionType.NATIONAL_TEAMS
        ? {
            qualifiedNationalTeamIds:
              nextRound === MatchType.THIRD_PLACE ? losers : winners,
          }
        : {
            qualifiedClubIds:
              nextRound === MatchType.THIRD_PLACE ? losers : winners,
          }),
    }));

    await this.knockoutRoundService.resolveRoundAndCreateNextRounds(
      currentRound.id,
      roundsToCreate,
      eliminatedParticipantIds,
    );
  }

  async createKnockoutRoundMatches(
    knockoutRoundId: number,
    competitionEditionId: number,
    type: MatchType,
    ties: CreateMatchDto[][],
  ) {
    return this.repo.createKnockoutRoundMatches(
      knockoutRoundId,
      competitionEditionId,
      type,
      ties,
    );
  }

  // private methods (helpers)

  private validateMatchResult(
    match: UpdateMatchDto,
    format: CompetitionFormat,
    matchType: MatchType,
    finishType: MatchFinishType,
    isTwoLeggedKnockout: boolean,
    secondLegAggregateIsTied: boolean,
  ) {
    const isAGroupStageMatch =
      format === CompetitionFormat.GROUPS_AND_KNOCKOUT &&
      matchType === MatchType.GROUP_STAGE;

    const isALeagueMatch = matchType === MatchType.LEAGUE;

    const theUserEnteredPenalties =
      match.homePenaltyGoals || match.awayPenaltyGoals;

    const isATiedKnockout =
      isKnockoutMatch(matchType) &&
      !isTwoLeggedKnockout &&
      match.homeGoals === match.awayGoals;

    if (isALeagueMatch && finishType === MatchFinishType.EXTRA_TIME)
      throw new BadRequestException("A league match can't end in extra time");

    switch (finishType) {
      case MatchFinishType.PENALTIES:
        if (match.homeGoals !== match.awayGoals && !secondLegAggregateIsTied)
          throw new BadRequestException(
            'If the match reached the penalties, you should enter a tied score',
          );
        if (!match.homePenaltyGoals || !match.awayPenaltyGoals)
          throw new BadRequestException(
            'If the match reached the penalties, you should enter the penalty score for both home and away club',
          );
        if (match.homePenaltyGoals === match.awayPenaltyGoals)
          throw new BadRequestException("The penalties can't end in a tie");
        if (isAGroupStageMatch)
          throw new BadRequestException(
            "A group stage match can't end in penalties",
          );

        if (isALeagueMatch)
          throw new BadRequestException(
            "A league match can't end in penalties",
          );
        break;
      case MatchFinishType.REGULAR_TIME:
      case MatchFinishType.EXTRA_TIME:
        if (theUserEnteredPenalties)
          throw new BadRequestException(
            "If the match didn't reached the penalties, you shouldn't enter them",
          );

        if (isAGroupStageMatch && theUserEnteredPenalties)
          throw new BadRequestException(
            "This is a group stage match, you shouldn't enter a penalty shootout result",
          );

        if (isATiedKnockout)
          throw new BadRequestException("A knockout can't end in a tie");
        break;
    }
  }

  private validateTwoLeggedResult(
    firstLeg: Match,
    secondLeg: MatchResponseDto,
    result: UpdateMatchDto,
    finishType: MatchFinishType,
  ): boolean {
    const firstHomeId = firstLeg.homeNationalTeamId ?? firstLeg.homeClubId;
    const firstAwayId = firstLeg.awayNationalTeamId ?? firstLeg.awayClubId;
    const secondHomeId = secondLeg.homeNationalTeamId ?? secondLeg.homeClubId;
    const secondAwayId = secondLeg.awayNationalTeamId ?? secondLeg.awayClubId;
    if (
      firstHomeId === null ||
      firstAwayId === null ||
      secondHomeId === null ||
      secondAwayId === null ||
      ![firstHomeId, firstAwayId].includes(secondHomeId) ||
      ![firstHomeId, firstAwayId].includes(secondAwayId)
    ) {
      throw new BadRequestException(
        'Both legs must feature the same two participants.',
      );
    }

    const firstClubSecondLegGoals =
      secondHomeId === firstHomeId ? result.homeGoals : result.awayGoals;
    const secondClubSecondLegGoals =
      secondHomeId === firstAwayId ? result.homeGoals : result.awayGoals;

    const firstClubAggregateGoals =
      firstLeg.homeGoals + firstClubSecondLegGoals;
    const secondClubAggregateGoals =
      firstLeg.awayGoals + secondClubSecondLegGoals;
    const aggregateIsTied =
      firstClubAggregateGoals === secondClubAggregateGoals;

    if (aggregateIsTied && finishType !== MatchFinishType.PENALTIES)
      throw new BadRequestException(
        'The aggregate score is tied. The second leg must be decided by penalties.',
      );

    if (!aggregateIsTied && finishType === MatchFinishType.PENALTIES)
      throw new BadRequestException(
        'Penalties can only be used when the aggregate score is tied.',
      );

    return aggregateIsTied;
  }

  private validateLegOrder(matches: MatchResponseDto[]): Match {
    const firstLeg = matches.find(({ leg }) => leg === MatchLeg.FIRST);

    if (!firstLeg || firstLeg.status !== MatchStatus.PLAYED)
      throw new ConflictException(
        'Before playing the second leg, you should finish the first',
      );

    return MatchMapper.toModelFromResponse(firstLeg);
  }

  private validateMatchClubStats(
    clubStats: CreateMatchClubStatsDto[],
    match: ClubMatchResponse,
  ) {
    if (clubStats.length !== 2)
      throw new BadRequestException(
        'The list of clubs must contain only 2 clubs',
      );

    const clubIds = clubStats.map(({ clubId }) => clubId);

    if (new Set(clubIds).size !== clubIds.length) {
      throw new BadRequestException(
        'A club cannot have multiple stat records for the same match.',
      );
    }

    const homeClubStats = clubStats.find(
      ({ clubId }) => clubId === match.homeClub.id,
    );

    const awayClubStats = clubStats.find(
      ({ clubId }) => clubId === match.awayClub.id,
    );

    if (!homeClubStats || !awayClubStats)
      throw new BadRequestException(
        "One of the clubs whose stats you are trying to create didn't play this match.",
      );

    if (homeClubStats.possession + awayClubStats.possession !== 100)
      throw new BadRequestException(
        'The total club possession must be exactly 100%.',
      );

    for (const club of clubStats) {
      if (club.shotsOnTarget > club.shots)
        throw new BadRequestException(
          "The total number of shots on target can't be greater than the total number of shots.",
        );
    }
  }

  private getWinnerClubId(
    match: ClubMatchResponse,
    data: UpdateMatchDto,
    finishType: MatchFinishType,
  ) {
    if (
      finishType === MatchFinishType.PENALTIES &&
      data.homePenaltyGoals &&
      data.awayPenaltyGoals
    )
      return data.homePenaltyGoals > data.awayPenaltyGoals
        ? match.homeClub.id
        : match.awayClub.id;

    if (data.homeGoals > data.awayGoals) return match.homeClub.id;
    else if (data.awayGoals > data.homeGoals) return match.awayClub.id;
    else return null;
  }

  private getWinnerParticipantId(
    match: MatchResponseDto,
    data: UpdateMatchDto,
    finishType: MatchFinishType,
  ) {
    const homeId = match.homeNationalTeamId ?? match.homeClubId;
    const awayId = match.awayNationalTeamId ?? match.awayClubId;
    if (homeId === null || awayId === null)
      throw new BadRequestException('The match must have two participants.');

    if (
      finishType === MatchFinishType.PENALTIES &&
      data.homePenaltyGoals !== undefined &&
      data.awayPenaltyGoals !== undefined
    )
      return data.homePenaltyGoals > data.awayPenaltyGoals ? homeId : awayId;

    if (data.homeGoals > data.awayGoals) return homeId;
    if (data.awayGoals > data.homeGoals) return awayId;
    return null;
  }
}
