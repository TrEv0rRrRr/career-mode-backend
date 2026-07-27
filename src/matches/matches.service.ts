import { BadRequestException, Injectable } from '@nestjs/common';
import { MatchFinishType } from '@prisma/client';
import { inferMatchType } from '../common/helpers/inferMatchType.ts';
import { CompetitionsService } from '../competitions/competitions.service.ts';
import { StadiumsService } from '../stadiums/stadiums.service.ts';
import { TeamsService } from '../teams/teams.service.ts';
import { CreateMatchDto } from './dto/create-match.dto.ts';
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

    if (data.homeTeamId === data.awayTeamId)
      throw new BadRequestException('The teams must be different');

    const registeredTeams =
      await this.competitionsService.countCompetitionParticipants(
        competitionEditionId,
      );

    const type = inferMatchType(edition.competition, registeredTeams);

    return this.repo.create(type, data);
  }

  async updateMatch(matchId: number, data: UpdateMatchDto) {
    await this.findMatch(matchId);
    const matchFinishType = data.finishType;

    switch (matchFinishType) {
      case MatchFinishType.PENALTIES:
        if (data.homeGoals !== data.awayGoals)
          throw new BadRequestException(
            'If the match reached the penalties, you should enter a tied score',
          );
        if (!data.homePenaltyGoals || !data.awayPenaltyGoals)
          throw new BadRequestException(
            'If the match reached the penalties, you should enter the penalty score for both home and away team',
          );
        if (data.homePenaltyGoals === data.awayPenaltyGoals)
          throw new BadRequestException("The penalties can't end in a tie");
        break;
      case MatchFinishType.REGULAR_TIME:
      case MatchFinishType.EXTRA_TIME:
        if (data.homePenaltyGoals || data.awayPenaltyGoals)
          throw new BadRequestException(
            "If the match didn't reached the penalties, you shouldn't enter them",
          );
        break;
    }

    return this.repo.update(matchId, data);
  }
}
