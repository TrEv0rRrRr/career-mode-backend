import { Injectable } from '@nestjs/common';
import { CompetitionFormat, CompetitionType, Prisma } from '@prisma/client';
import { matchInclude } from '../matches/matches.repository.ts';
import { PrismaService } from '../prisma/prisma.service.ts';
import { ChangeEditionFinalStadiumDto } from './dto/change-edition-final-stadium.dto.ts';
import { CreateManyEditionsDto } from './dto/create-many-editions.dto.ts';
import { UpdateCompetitionEditionDto } from './dto/update-competition-edition.dto.ts';

const competitionEditionInclude = {
  competition: true,
  season: true,
  winnerClub: true,
  runnerUpClub: true,
  stadium: true,
  competitionParticipants: {
    include: {
      club: true,
    },
  },
  nationalTeamParticipants: {
    include: {
      nationalTeam: true,
    },
  },
} as const;

const competitionEditionByIdInclude = {
  competition: true,
  season: true,
  winnerClub: true,
  runnerUpClub: true,
  competitionParticipants: true,
} as const;

export type CompetitionEditionWithRelations =
  Prisma.CompetitionEditionGetPayload<{
    include: typeof competitionEditionInclude;
  }>;

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

  findByFormat(format: CompetitionFormat) {
    return this.prisma.competition.findMany({
      where: {
        format,
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
      include: competitionEditionByIdInclude,
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

  findEditionsOfTheCurrentSeason(seasonId: number) {
    return this.prisma.competitionEdition.findMany({
      where: {
        seasonId,
      },
      include: competitionEditionInclude,
    });
  }

  findEditionsBySeason(seasonId: number) {
    return this.prisma.competitionEdition.findMany({
      where: {
        seasonId,
      },
      include: competitionEditionInclude,
    });
  }

  createEditionsForTheCurrentSeason(
    seasonId: number,
    data: CreateManyEditionsDto[],
  ) {
    const compEdData = data.map((d) => ({
      competitionId: d.competitionId,
      finalStadiumId: d.finalStadiumId,
      seasonId,
    }));

    return this.prisma.$transaction(async (tx) => {
      return tx.competitionEdition.createMany({
        data: compEdData,
      });
    });
  }

  changeEditionFinalStadium(
    editionId: number,
    data: ChangeEditionFinalStadiumDto,
  ) {
    return this.prisma.competitionEdition.update({
      where: { id: editionId },
      data,
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
        club: true,
      },
    });
  }

  findNationalTeamCompetitionParticipants(competitionEditionId: number) {
    return this.prisma.nationalTeamCompetitionParticipant.findMany({
      where: {
        competitionEditionId,
      },
      include: {
        nationalTeam: true,
      },
    });
  }

  findLeagueStandings(competitionEditionId: number) {
    return this.prisma.competitionParticipant.findMany({
      where: {
        competitionEditionId,
      },
      include: {
        club: true,
      },
      orderBy: [{ position: 'asc' }, { clubId: 'asc' }],
    });
  }

  findCompetitionGroupParticipants(competitionEditionId: number) {
    return this.prisma.competitionParticipant.findMany({
      where: {
        competitionEditionId,
        group: { not: null },
      },
      include: {
        club: true,
      },
      orderBy: [{ group: 'asc' }, { position: 'asc' }, { clubId: 'asc' }],
    });
  }

  registerParticipant(competitionEditionId: number, clubIds: number[]) {
    const clubSeasonData = clubIds.map((clubId) => ({
      competitionEditionId,
      clubId,
      points: 0,
    }));

    return this.prisma.competitionParticipant.createMany({
      data: clubSeasonData,
    });
  }

  registerNationalTeamParticipants(
    competitionEditionId: number,
    nationalTeamIds: number[],
  ) {
    return this.prisma.nationalTeamCompetitionParticipant.createMany({
      data: nationalTeamIds.map((nationalTeamId) => ({
        competitionEditionId,
        nationalTeamId,
        points: 0,
      })),
    });
  }

  countCompetitionParticipants(competitionEditionId: number) {
    return this.prisma.competitionParticipant.count({
      where: {
        competitionEditionId,
      },
    });
  }

  countNationalTeamCompetitionParticipants(competitionEditionId: number) {
    return this.prisma.nationalTeamCompetitionParticipant.count({
      where: {
        competitionEditionId,
      },
    });
  }

  replaceCompetitionParticipants(
    competitionEditionId: number,
    clubIds: number[],
  ) {
    const clubSeasonData = clubIds.map((clubId) => ({
      competitionEditionId,
      clubId,
      points: 0,
    }));

    return this.prisma.$transaction(async (tx) => {
      await tx.competitionParticipant.deleteMany({
        where: {
          competitionEditionId,
        },
      });
      await tx.nationalTeamCompetitionParticipant.deleteMany({
        where: {
          competitionEditionId,
        },
      });

      await tx.competitionParticipant.createMany({
        data: clubSeasonData,
      });
    });
  }

  replaceNationalTeamCompetitionParticipants(
    competitionEditionId: number,
    nationalTeamIds: number[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      await tx.competitionParticipant.deleteMany({
        where: {
          competitionEditionId,
        },
      });
      await tx.nationalTeamCompetitionParticipant.deleteMany({
        where: {
          competitionEditionId,
        },
      });
      await tx.nationalTeamCompetitionParticipant.createMany({
        data: nationalTeamIds.map((nationalTeamId) => ({
          competitionEditionId,
          nationalTeamId,
          points: 0,
        })),
      });
    });
  }

  deleteCompetitionParticipant(competitionEditionId: number, clubId: number) {
    return this.prisma.competitionParticipant.delete({
      where: {
        clubId_competitionEditionId: {
          competitionEditionId,
          clubId,
        },
      },
    });
  }

  deleteNationalTeamCompetitionParticipant(
    competitionEditionId: number,
    nationalTeamId: number,
  ) {
    return this.prisma.nationalTeamCompetitionParticipant.delete({
      where: {
        nationalTeamId_competitionEditionId: {
          competitionEditionId,
          nationalTeamId,
        },
      },
    });
  }

  findCompetitionParticipant(competitionEditionId: number, clubId: number) {
    return this.prisma.competitionParticipant.findUnique({
      where: {
        clubId_competitionEditionId: {
          competitionEditionId,
          clubId,
        },
      },
    });
  }

  findNationalTeamCompetitionParticipant(
    competitionEditionId: number,
    nationalTeamId: number,
  ) {
    return this.prisma.nationalTeamCompetitionParticipant.findUnique({
      where: {
        nationalTeamId_competitionEditionId: {
          competitionEditionId,
          nationalTeamId,
        },
      },
    });
  }

  // ! Competition Matches
  findCompetitionMatches(competitionEditionId: number) {
    return this.prisma.match.findMany({
      where: {
        competitionEditionId,
      },
      include: matchInclude,
    });
  }
}
