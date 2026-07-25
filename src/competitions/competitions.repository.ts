import { Injectable } from '@nestjs/common';
import { CompetitionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.ts';
import { CreateCompetitionEditionDto } from './dto/create-competition-edition.dto.ts';
import { UpdateCompetitionEditionDto } from './dto/update-competition-edition.dto.ts';

const competitionEditionInclude = {
  competition: true,
  season: true,
  winnerTeam: true,
  runnerUpTeam: true,
} as const;

@Injectable()
export class CompetitionsRepository {
  constructor(private prisma: PrismaService) {}

  findById(id: number) {
    return this.prisma.competition.findFirst({ where: { id } });
  }

  findAll() {
    return this.prisma.competition.findMany();
  }

  findByType(type: CompetitionType) {
    return this.prisma.competition.findMany({
      where: {
        type,
      },
    });
  }

  // ! Competition Edition queries

  findEditionsByCompetition(competitionId: number) {
    return this.prisma.competitionEdition.findMany({
      where: {
        competitionId,
      },
      include: competitionEditionInclude,
    });
  }

  findCompetitionEditionById(competitionId: number, editionId: number) {
    return this.prisma.competitionEdition.findUnique({
      where: {
        id: editionId,
        competitionId,
      },
      include: competitionEditionInclude,
    });
  }

  findEditionByCompetitionAndSeason(competitionId: number, seasonId: number) {
    return this.prisma.competitionEdition.findUnique({
      where: {
        seasonId_competitionId: {
          seasonId,
          competitionId,
        },
      },
    });
  }

  createEdition(competitionId: number, data: CreateCompetitionEditionDto) {
    return this.prisma.competitionEdition.create({
      data: {
        competitionId,
        seasonId: data.seasonId,
      },
    });
  }

  assignWinnerAndRunnerUp(
    editionId: number,
    data: UpdateCompetitionEditionDto,
  ) {
    return this.prisma.competitionEdition.update({
      where: { id: editionId },
      data,
    });
  }

  // ! Team Season queries

  findCompetitionTeams(competitionId: number, seasonId: number) {
    return this.prisma.teamSeason.findMany({
      where: {
        competitionId,
        seasonId,
      },
      include: {
        team: true,
      },
    });
  }

  assignTeam(competitionId: number, seasonId: number, teamId: number) {
    return this.prisma.teamSeason.create({
      data: {
        competitionId,
        teamId,
        seasonId,
      },
    });
  }

  replaceCompetitionTeams(
    competitionId: number,
    seasonId: number,
    teamIds: number[],
  ) {
    const teamSeasonData = teamIds.map((teamId) => ({
      competitionId,
      seasonId,
      teamId,
    }));

    return this.prisma.$transaction(async (tx) => {
      await tx.teamSeason.deleteMany({
        where: {
          competitionId,
          seasonId,
        },
      });

      await tx.teamSeason.createMany({
        data: teamSeasonData,
      });
    });
  }

  removeTeam(competitionId: number, seasonId: number, teamId: number) {
    return this.prisma.teamSeason.delete({
      where: {
        teamId_seasonId_competitionId: {
          competitionId,
          seasonId,
          teamId,
        },
      },
    });
  }

  findTeamSeason(competitionId: number, seasonId: number, teamId: number) {
    return this.prisma.teamSeason.findUnique({
      where: {
        teamId_seasonId_competitionId: {
          competitionId,
          seasonId,
          teamId,
        },
      },
    });
  }
}
