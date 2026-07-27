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
  competitionParticipants: true,
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

  findEditionById(editionId: number) {
    return this.prisma.competitionEdition.findUnique({
      where: {
        id: editionId,
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
      include: competitionEditionInclude,
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

  // ! Competition Participant queries

  findCompetitionParticipants(competitionEditionId: number) {
    return this.prisma.competitionParticipant.findMany({
      where: {
        competitionEditionId,
      },
      include: {
        team: true,
      },
    });
  }

  registerParticipant(competitionEditionId: number, teamId: number) {
    return this.prisma.competitionParticipant.create({
      data: {
        competitionEditionId,
        teamId,
      },
    });
  }

  countCompetitionParticipants(competitionEditionId: number) {
    return this.prisma.competitionParticipant.count({
      where: {
        competitionEditionId,
      },
    });
  }

  replaceCompetitionParticipants(
    competitionEditionId: number,
    teamIds: number[],
  ) {
    const teamSeasonData = teamIds.map((teamId) => ({
      competitionEditionId,
      teamId,
    }));

    return this.prisma.$transaction(async (tx) => {
      await tx.competitionParticipant.deleteMany({
        where: {
          competitionEditionId,
        },
      });

      await tx.competitionParticipant.createMany({
        data: teamSeasonData,
      });
    });
  }

  deleteCompetitionParticipant(competitionEditionId: number, teamId: number) {
    return this.prisma.competitionParticipant.delete({
      where: {
        teamId_competitionEditionId: {
          competitionEditionId,
          teamId,
        },
      },
    });
  }

  findCompetitionParticipant(competitionEditionId: number, teamId: number) {
    return this.prisma.competitionParticipant.findUnique({
      where: {
        teamId_competitionEditionId: {
          competitionEditionId,
          teamId,
        },
      },
    });
  }
}
