import { BadRequestException, Injectable } from '@nestjs/common';
import { Match, MatchFinishType, MatchStatus } from '@prisma/client';
import { inferFirstKnockoutRound } from '../common/helpers/inferFirstKnockoutRound.ts';
import { CompetitionsService } from '../competitions/competitions.service.ts';
import { StadiumsService } from '../stadiums/stadiums.service.ts';
import { TeamsService } from '../teams/teams.service.ts';
import { ChangeMatchStadiumDTO } from './dto/change-match-stadium.dto.ts';
import { CreateMatchDto } from './dto/create-match.dto.ts';
import { PlayMatchDto } from './dto/play-match.dto.ts';
import { CreateMatchTeamStatsDto } from './dto/stats/create-match-team-stats.dto.ts';
import { UpdateMatchDto } from './dto/update-match.dto.ts';
import { MatchNotFoundException } from './exceptions/match-not-found.exception.ts';
import { MatchesRepository } from './matches.repository.ts';

@Injectable()
export class MatchesService {
  constructor(
    private repo: MatchesRepository,
    private teamsService: TeamsService,
    private stadiumsService: StadiumsService,
    private competitionsService: CompetitionsService,
  ) {}

  async findMatch(matchId: number) {
    const match = await this.repo.findOne(matchId);

    if (!match) throw new MatchNotFoundException();

    return match;
  }

  async changeStadium(matchId: number, data: ChangeMatchStadiumDTO) {
    await this.findMatch(matchId);
    await this.stadiumsService.findStadiumById(data.stadiumId);

    return this.repo.changeStadium(matchId, data);
  }

  async createManyMatches(
    competitionEditionId: number,
    data: CreateMatchDto[],
  ) {
    const edition =
      await this.competitionsService.findCompetitionEditionById(
        competitionEditionId,
      );
    const type = inferFirstKnockoutRound(edition.competition);

    return this.repo.createMany(type, data);
  }

  async countMatchesByCompetitionEdition(competitionEditionId: number) {
    await this.competitionsService.findCompetitionEditionById(
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

    await this.competitionsService.findCompetitionParticipant(
      competitionEditionId,
      data.homeTeamId,
      "The home team doesn't participate in the given competition",
    );

    await this.competitionsService.findCompetitionParticipant(
      competitionEditionId,
      data.awayTeamId,
      "The away team doesn't participate in the given competition",
    );

    await this.stadiumsService.findStadiumById(data.stadiumId);

    const edition =
      await this.competitionsService.findCompetitionEditionById(
        competitionEditionId,
      );

    if (edition.competition.hasTwoLeggedKnockout && !data.leg)
      throw new BadRequestException(
        'Since the competition has a two legged knockout, you have to enter the match leg',
      );

    if (data.homeTeamId === data.awayTeamId)
      throw new BadRequestException('The teams must be different');

    const type = inferFirstKnockoutRound(edition.competition);

    return this.repo.create(type, data);
  }

  validateMatchResult(match: UpdateMatchDto) {
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

  validateMatchTeamStats(teamStats: CreateMatchTeamStatsDto[], match: Match) {
    const homeTeam = teamStats[0];
    const awayTeam = teamStats[1];

    if (
      homeTeam.teamId !== match.homeTeamId ||
      awayTeam.teamId !== match.awayTeamId
    )
      throw new BadRequestException(
        "One of the teams you are trying to create its stats didn't play match.",
      );
  }

  getWinnerTeamId(match: Match, data: UpdateMatchDto) {
    if (data.homeGoals > data.awayGoals) return match.homeTeamId;
    else if (data.awayGoals > data.homeGoals) return match.awayTeamId;
    else if (match.finishType === MatchFinishType.PENALTIES)
      return data.homePenaltyGoals! > data.awayPenaltyGoals!
        ? match.homeTeamId
        : match.awayTeamId;
    else return undefined;
  }

  async playMatch(matchId: number, data: PlayMatchDto) {
    const match = await this.findMatch(matchId);

    if (match.status === MatchStatus.PLAYED)
      throw new BadRequestException('This match has already been played');

    this.validateMatchResult(data.match);
    this.validateMatchTeamStats(data.teamStats, match);

    const winnerTeamId = this.getWinnerTeamId(match, data.match);

    return this.repo.playMatch(matchId, winnerTeamId, data);
  }
}
