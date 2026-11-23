import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CompetitionFormat,
  CompetitionParticipant,
  Match,
  MatchFinishType,
  MatchStatus,
  MatchType,
  Prisma,
  PrismaClient,
} from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/client';
import { recalculateStandings } from '../common/helpers/gp-leagues/recalculateStandings.ts';
import { isKnockoutMatch } from '../common/helpers/knockouts/isKnockoutMatch.ts';
import { resolveKnockoutWinners } from '../common/helpers/knockouts/resolveKnockoutWinners.ts';
import { StandingClub } from '../common/types/StandingClub.ts';
import { PrismaService } from '../prisma/prisma.service.ts';
import { ChangeMatchStadiumDTO } from './dto/change-match-stadium.dto.ts';
import { CreateMatchDto } from './dto/create-match.dto.ts';
import { PlayMatchDto } from './dto/play-match.dto.ts';

type fairPlayStatsType = (Prisma.PickEnumerable<
  Prisma.MatchPlayerStatsGroupByOutputType,
  'clubId'[]
> & {
  _sum: {
    redCards: number | null;
    yellowCards: number | null;
  };
})[];

type txType = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$use' | '$extends'
>;

export const matchInclude = {
  homeClub: true,
  awayClub: true,
  homeNationalTeam: true,
  awayNationalTeam: true,
  matchClubStats: true,
  matchPlayerStats: true,
  stadium: true,
} satisfies Prisma.MatchInclude;

export type MatchWithRelations = Prisma.MatchGetPayload<{
  include: typeof matchInclude;
}>;

export const tieWithMatchesInclude = {
  matches: {
    include: matchInclude,
  },
} satisfies Prisma.TieInclude;

export type TieWithMatches = Prisma.TieGetPayload<{
  include: typeof tieWithMatchesInclude;
}>;

@Injectable()
export class MatchesRepository {
  constructor(private prisma: PrismaService) {}

  findOne(matchId: number): Promise<MatchWithRelations | null> {
    return this.prisma.match.findUnique({
      where: { id: matchId },
      include: matchInclude,
    });
  }

  findMatchesByRound(competitionEditionId: number, matchType: MatchType) {
    return this.prisma.match.findMany({
      where: {
        competitionEditionId,
        type: matchType,
      },
    });
  }

  findMatchesByTieId(tieId: number): Promise<TieWithMatches | null> {
    return this.prisma.tie.findUnique({
      where: {
        id: tieId,
      },
      include: tieWithMatchesInclude,
    });
  }

  countByCompetitionEdition(competitionEditionId: number) {
    return this.prisma.match.count({ where: { competitionEditionId } });
  }

  create(competitionEditionId: number, type: MatchType, data: CreateMatchDto) {
    const matchData = {
      ...data,
      competitionEditionId,
      type,
      status: MatchStatus.SCHEDULED,
      homeGoals: 0,
      awayGoals: 0,
      homePenaltyGoals: null,
      awayPenaltyGoals: null,
      finishType: null,
    };

    return this.prisma.match.create({
      data: matchData,
    });
  }

  createMany(
    competitionEditionId: number,
    type: MatchType,
    data: CreateMatchDto[],
  ) {
    if (isKnockoutMatch(type)) {
      throw new BadRequestException(
        'Use createKnockoutRoundMatches to create knockout matches.',
      );
    }

    const matchData = data.map((match) => ({
      ...match,
      type,
      status: MatchStatus.SCHEDULED,
      homeGoals: 0,
      awayGoals: 0,
      homePenaltyGoals: null,
      awayPenaltyGoals: null,
      finishType: null,
      tieId: null,
      competitionEditionId,
    }));

    return this.prisma.match.createMany({ data: matchData });
  }

  async createKnockoutRoundMatches(
    knockoutRoundId: number,
    competitionEditionId: number,
    type: MatchType,
    ties: CreateMatchDto[][],
  ) {
    return this.prisma.$transaction(async (tx) => {
      for (const matches of ties) {
        const tie = await tx.tie.create({
          data: { knockoutRoundId },
        });

        await tx.match.createMany({
          data: matches.map((match) => ({
            ...match,
            tieId: tie.id,
            competitionEditionId,
            type,
            status: MatchStatus.SCHEDULED,
          })),
        });
      }
    });
  }

  async createGroupStageMatches(
    competitionEditionId: number,
    groups: Record<string, number[]>,
    matches: CreateMatchDto[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      for (const [group, clubIds] of Object.entries(groups)) {
        const updatedParticipants = await tx.competitionParticipant.updateMany({
          where: {
            competitionEditionId,
            clubId: { in: clubIds },
          },
          data: {
            group,
            position: null,
            points: 0,
            played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            gf: 0,
            ga: 0,
            gd: 0,
          },
        });

        if (updatedParticipants.count !== clubIds.length) {
          throw new BadRequestException(
            'A group contains clubs that do not participate in this competition edition.',
          );
        }
      }

      return tx.match.createMany({
        data: matches.map((match) => ({
          ...match,
          type: MatchType.GROUP_STAGE,
          status: MatchStatus.SCHEDULED,
          homeGoals: 0,
          awayGoals: 0,
          homePenaltyGoals: null,
          awayPenaltyGoals: null,
          finishType: null,
          tieId: null,
          competitionEditionId,
        })),
      });
    });
  }

  async recalculateLeagueStandings(
    matches: Match[],
    competitionParticipants: CompetitionParticipant[],
    fairPlayStats: fairPlayStatsType,
    competitionEditionId: number,
    tx: txType,
  ) {
    const participants: StandingClub[] = competitionParticipants.map(
      (participant) => {
        const fairPlay = fairPlayStats.find(
          (stat) => stat.clubId === participant.clubId,
        );

        if (participant.points === null) {
          throw new Error(
            'A competition participant with standings must have points.',
          );
        }

        return {
          clubId: participant.clubId,
          points: participant.points,
          group: participant.group,
          gf: participant.gf,
          ga: participant.ga,
          gd: participant.gd,
          redCards: fairPlay?._sum.redCards || 0,
          yellowCards: fairPlay?._sum.yellowCards || 0,
        };
      },
    );

    const standings = recalculateStandings(participants, matches);

    for (const [index, club] of standings.entries()) {
      await tx.competitionParticipant.update({
        where: {
          clubId_competitionEditionId: {
            clubId: club.clubId,
            competitionEditionId,
          },
        },
        data: {
          position: index + 1,
        },
      });
    }
  }

  async recalculateGroupStandings(
    matches: Match[],
    groups: string[],
    competitionParticipants: CompetitionParticipant[],
    competitionEditionId: number,
    fairPlayStats: fairPlayStatsType,
    tx: txType,
  ) {
    for (const group of groups) {
      const groupParticipants = competitionParticipants.filter(
        (participant) => participant.group === group,
      );

      const groupClubIds = new Set(
        groupParticipants.map(({ clubId }) => clubId),
      );

      const groupMatches = matches.filter(
        (match) =>
          match.homeClubId !== null &&
          match.awayClubId !== null &&
          groupClubIds.has(match.homeClubId) &&
          groupClubIds.has(match.awayClubId) &&
          match.type === MatchType.GROUP_STAGE,
      );

      const participants: StandingClub[] = groupParticipants.map(
        (participant) => {
          const fairPlay = fairPlayStats.find(
            (stats) => stats.clubId === participant.clubId,
          );

          if (participant.points === null) {
            throw new Error('A group participant must have points.');
          }

          return {
            clubId: participant.clubId,
            points: participant.points,
            gf: participant.gf,
            ga: participant.ga,
            gd: participant.gd,
            redCards: fairPlay?._sum.redCards ?? 0,
            yellowCards: fairPlay?._sum.yellowCards ?? 0,
          };
        },
      );

      const standings = recalculateStandings(participants, groupMatches);

      for (const [index, club] of standings.entries()) {
        await tx.competitionParticipant.update({
          where: {
            clubId_competitionEditionId: {
              clubId: club.clubId,
              competitionEditionId,
            },
          },
          data: {
            position: index + 1,
          },
        });
      }
    }
  }

  playMatch(
    matchId: number,
    competitionFormat: CompetitionFormat,
    playerClubsIds: Map<number, number>,
    seasonId: number,
    winnerId: number | null,
    isNationalTeamsMatch: boolean,
    data: PlayMatchDto,
    finishType: MatchFinishType,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const updatedMatch = await tx.match.update({
        where: { id: matchId },
        data: {
          ...data.match,
          finishType,
          status: MatchStatus.PLAYED,
          winnerClubId: isNationalTeamsMatch ? null : winnerId,
          winnerNationalTeamId: isNationalTeamsMatch ? winnerId : null,
        },
      });

      const homeClubId = updatedMatch.homeClubId;
      const awayClubId = updatedMatch.awayClubId;

      if (homeClubId === null || awayClubId === null) {
        if (
          isNationalTeamsMatch &&
          updatedMatch.homeNationalTeamId !== null &&
          updatedMatch.awayNationalTeamId !== null &&
          data.playerStats.length === 0 &&
          data.clubStats.length === 0
        ) {
          return updatedMatch;
        }
        throw new BadRequestException(
          'Player and club stats can only be recorded for club matches.',
        );
      }

      await tx.matchPlayerStats.createMany({
        data: data.playerStats.map((stats) => ({
          ...stats,
          matchId,
          clubId: playerClubsIds.get(stats.playerId)!,
        })),
      });

      await tx.matchClubStats.createMany({
        data: data.clubStats.map((stats) => ({
          ...stats,
          matchId,
        })),
      });

      for (const stats of data.playerStats) {
        const playerId = stats.playerId;
        const clubId = playerClubsIds.get(playerId)!;

        const currentStats = await tx.playerSeasonStats.findUnique({
          where: {
            playerId_clubId_seasonId: {
              playerId,
              clubId,
              seasonId,
            },
          },
        });

        const newRating = currentStats
          ? (Number(currentStats.rating) * currentStats.matches +
              stats.rating) /
            (currentStats.matches + 1)
          : stats.rating;

        await tx.playerSeasonStats.upsert({
          where: {
            playerId_clubId_seasonId: {
              playerId,
              clubId,
              seasonId,
            },
          },
          create: {
            playerId,
            clubId,
            seasonId,
            matches: 1,
            assists: stats.assists,
            goals: stats.goals,
            rating: stats.rating,
            redCards: stats.redCards,
            yellowCards: stats.yellowCards,
          },
          update: {
            matches: { increment: 1 },
            goals: { increment: stats.goals },
            assists: { increment: stats.assists },
            yellowCards: { increment: stats.yellowCards },
            redCards: { increment: stats.redCards },
            rating: newRating,
          },
        });
      }

      const isHomeWinner = data.match.homeGoals > data.match.awayGoals;

      const isDraw = data.match.homeGoals === data.match.awayGoals;

      const isAwayWinner = data.match.awayGoals > data.match.homeGoals;

      const updateHomeClubSeasonStats = {
        played: { increment: 1 },
        wins: { increment: isHomeWinner ? 1 : 0 },
        draws: { increment: isDraw ? 1 : 0 },
        losses: { increment: isAwayWinner ? 1 : 0 },
        gf: { increment: data.match.homeGoals },
        ga: { increment: data.match.awayGoals },
        gd: { increment: data.match.homeGoals - data.match.awayGoals },
      };

      const updateAwayClubSeasonStats = {
        played: { increment: 1 },
        wins: { increment: isAwayWinner ? 1 : 0 },
        draws: { increment: isDraw ? 1 : 0 },
        losses: { increment: isHomeWinner ? 1 : 0 },
        gf: { increment: data.match.awayGoals },
        ga: { increment: data.match.homeGoals },
        gd: { increment: data.match.awayGoals - data.match.homeGoals },
      };

      await tx.clubSeasonStats.upsert({
        where: {
          clubId_seasonId: {
            clubId: homeClubId,
            seasonId,
          },
        },
        create: {
          clubId: homeClubId,
          seasonId,
          played: 1,
          wins: isHomeWinner ? 1 : 0,
          draws: isDraw ? 1 : 0,
          losses: isAwayWinner ? 1 : 0,
          gf: data.match.homeGoals,
          ga: data.match.awayGoals,
          gd: data.match.homeGoals - data.match.awayGoals,
        },
        update: updateHomeClubSeasonStats,
      });

      await tx.clubSeasonStats.upsert({
        where: {
          clubId_seasonId: {
            clubId: awayClubId,
            seasonId,
          },
        },
        create: {
          clubId: awayClubId,
          seasonId,
          played: 1,
          wins: isAwayWinner ? 1 : 0,
          draws: isDraw ? 1 : 0,
          losses: isHomeWinner ? 1 : 0,
          gf: data.match.awayGoals,
          ga: data.match.homeGoals,
          gd: data.match.awayGoals - data.match.homeGoals,
        },
        update: updateAwayClubSeasonStats,
      });

      const competitionEditionId = updatedMatch.competitionEditionId;

      const usesStandings =
        (competitionFormat === CompetitionFormat.LEAGUE &&
          updatedMatch.type === MatchType.LEAGUE) ||
        (competitionFormat === CompetitionFormat.GROUPS_AND_KNOCKOUT &&
          updatedMatch.type === MatchType.GROUP_STAGE);

      const homeParticipantUpdate = {
        ...(usesStandings && {
          played: { increment: 1 },
          wins: { increment: isHomeWinner ? 1 : 0 },
          draws: { increment: isDraw ? 1 : 0 },
          losses: { increment: isAwayWinner ? 1 : 0 },
          gf: { increment: data.match.homeGoals },
          ga: { increment: data.match.awayGoals },
          gd: { increment: data.match.homeGoals - data.match.awayGoals },
          points: {
            increment: isHomeWinner ? 3 : isDraw ? 1 : 0,
          },
        }),
      };

      const awayParticipantUpdate = {
        ...(usesStandings && {
          played: { increment: 1 },
          wins: { increment: isAwayWinner ? 1 : 0 },
          draws: { increment: isDraw ? 1 : 0 },
          losses: { increment: isHomeWinner ? 1 : 0 },
          gf: { increment: data.match.awayGoals },
          ga: { increment: data.match.homeGoals },
          gd: { increment: data.match.awayGoals - data.match.homeGoals },
          points: {
            increment: isAwayWinner ? 3 : isDraw ? 1 : 0,
          },
        }),
      };

      await tx.competitionParticipant.update({
        where: {
          clubId_competitionEditionId: {
            clubId: homeClubId,
            competitionEditionId,
          },
        },
        data: homeParticipantUpdate,
      });

      await tx.competitionParticipant.update({
        where: {
          clubId_competitionEditionId: {
            clubId: awayClubId,
            competitionEditionId,
          },
        },
        data: awayParticipantUpdate,
      });

      const matches = await tx.match.findMany({
        where: { competitionEditionId, status: MatchStatus.PLAYED },
      });

      const standingsMatchType =
        competitionFormat === CompetitionFormat.GROUPS_AND_KNOCKOUT
          ? MatchType.GROUP_STAGE
          : MatchType.LEAGUE;
      const matchIds = matches
        .filter((match) => match.type === standingsMatchType)
        .map(({ id }) => id);

      const competitionParticipants = await tx.competitionParticipant.findMany({
        where: { competitionEditionId },
      });

      const fairPlayStats = await tx.matchPlayerStats.groupBy({
        by: ['clubId'],
        where: {
          matchId: {
            in: matchIds,
          },
        },
        _sum: {
          redCards: true,
          yellowCards: true,
        },
      });

      const groups = [
        ...new Set(
          competitionParticipants
            .map((participant) => participant.group)
            .filter((group): group is string => group !== null),
        ),
      ];

      if (competitionFormat === CompetitionFormat.LEAGUE) {
        await this.recalculateLeagueStandings(
          matches,
          competitionParticipants,
          fairPlayStats,
          competitionEditionId,
          tx,
        );

        const leagueMatches = await tx.match.findMany({
          where: {
            competitionEditionId,
            type: MatchType.LEAGUE,
          },
          select: { status: true },
        });

        if (
          leagueMatches.length > 0 &&
          leagueMatches.every(({ status }) => status === MatchStatus.PLAYED)
        ) {
          const topClubs = await tx.competitionParticipant.findMany({
            where: { competitionEditionId },
            orderBy: [{ position: 'asc' }, { clubId: 'asc' }],
            take: 2,
            select: { clubId: true },
          });

          if (topClubs.length === 2) {
            await tx.competitionEdition.update({
              where: { id: competitionEditionId },
              data: {
                winnerClubId: topClubs[0].clubId,
                runnerUpClubId: topClubs[1].clubId,
              },
            });
          }
        }
      }

      if (
        competitionFormat === CompetitionFormat.GROUPS_AND_KNOCKOUT &&
        updatedMatch.type === MatchType.GROUP_STAGE
      ) {
        await this.recalculateGroupStandings(
          matches,
          groups,
          competitionParticipants,
          competitionEditionId,
          fairPlayStats,
          tx,
        );
        await this.finalizeGroupStageIfComplete(
          tx,
          competitionEditionId,
          fairPlayStats,
        );
      }

      const matchesByRound = await tx.match.findMany({
        where: {
          competitionEditionId,
          type: updatedMatch.type,
        },
      });

      const edition = await tx.competitionEdition.findFirst({
        where: { id: competitionEditionId },
        select: {
          competition: true,
        },
      });

      const roundFinished = matchesByRound.every(
        (match) => match.status === MatchStatus.PLAYED,
      );

      if (isKnockoutMatch(updatedMatch.type) && roundFinished) {
        resolveKnockoutWinners(edition, matchesByRound);
      }

      return updatedMatch;
    });
  }

  private async finalizeGroupStageIfComplete(
    tx: txType,
    competitionEditionId: number,
    fairPlayStats: fairPlayStatsType,
  ) {
    const groupStageMatches = await tx.match.findMany({
      where: {
        competitionEditionId,
        type: MatchType.GROUP_STAGE,
      },
      select: { status: true },
    });

    if (
      groupStageMatches.length === 0 ||
      !groupStageMatches.every(({ status }) => status === MatchStatus.PLAYED)
    )
      return;

    const edition = await tx.competitionEdition.findUniqueOrThrow({
      where: { id: competitionEditionId },
      select: {
        seasonId: true,
        competition: {
          select: {
            name: true,
            groups: true,
            teamsPerGroup: true,
          },
        },
      },
    });
    const participants = await tx.competitionParticipant.findMany({
      where: {
        competitionEditionId,
        group: { not: null },
      },
    });
    const groupedParticipants = new Map<string, CompetitionParticipant[]>();

    for (const participant of participants) {
      if (participant.group === null) continue;

      const group = groupedParticipants.get(participant.group) ?? [];
      group.push(participant);
      groupedParticipants.set(participant.group, group);
    }

    const isThreeGroupsOfFour =
      edition.competition.groups === 3 &&
      edition.competition.teamsPerGroup === 4 &&
      groupedParticipants.size === 3 &&
      [...groupedParticipants.values()].every((group) => group.length === 4);
    const thirdPlaceParticipants = participants.filter(
      ({ position }) => position === 3,
    );
    const fairPlayScore = (clubId: number) => {
      const stats = fairPlayStats.find((entry) => entry.clubId === clubId);
      return (stats?._sum.yellowCards ?? 0) + (stats?._sum.redCards ?? 0) * 3;
    };
    const bestThirdPlaceIds = isThreeGroupsOfFour
      ? [...thirdPlaceParticipants]
          .sort(
            (a, b) =>
              (b.points ?? 0) - (a.points ?? 0) ||
              b.gd - a.gd ||
              b.gf - a.gf ||
              fairPlayScore(a.clubId) - fairPlayScore(b.clubId),
          )
          .slice(0, 2)
          .map(({ clubId }) => clubId)
      : [];
    const europaLeagueThirdPlaceIds =
      edition.competition.name === 'UEFA Champions League'
        ? thirdPlaceParticipants.map(({ clubId }) => clubId)
        : [];

    if (europaLeagueThirdPlaceIds.length > 0) {
      const europaLeagueEdition = await tx.competitionEdition.findFirst({
        where: {
          seasonId: edition.seasonId,
          competition: {
            is: { name: 'UEFA Europa League' },
          },
        },
        select: { id: true },
      });

      if (!europaLeagueEdition) {
        throw new BadRequestException(
          `No UEFA Europa League edition exists for season ${edition.seasonId}.`,
        );
      }

      await tx.competitionParticipant.createMany({
        data: europaLeagueThirdPlaceIds.map((clubId) => ({
          competitionEditionId: europaLeagueEdition.id,
          clubId,
          points: 0,
        })),
        skipDuplicates: true,
      });
    }

    const qualifiedClubIds = new Set([
      ...participants
        .filter(({ position }) => position === 1 || position === 2)
        .map(({ clubId }) => clubId),
      ...bestThirdPlaceIds,
      ...europaLeagueThirdPlaceIds,
    ]);
    const eliminatedClubIds = participants
      .filter(({ clubId }) => !qualifiedClubIds.has(clubId))
      .map(({ clubId }) => clubId);

    if (eliminatedClubIds.length > 0) {
      await tx.competitionParticipant.deleteMany({
        where: {
          competitionEditionId,
          clubId: { in: eliminatedClubIds },
        },
      });
    }
  }

  changeStadium(matchId: number, data: ChangeMatchStadiumDTO) {
    return this.prisma.match.update({
      where: { id: matchId },
      data,
    });
  }

  // ! Match Player Stats Queries
  findMatchPlayerStats(matchId: number, playerId: number) {
    return this.prisma.matchPlayerStats.findUnique({
      where: {
        matchId_playerId: {
          matchId,
          playerId,
        },
      },
    });
  }

  // ! Match Club Stats Queries

  findMatchClubStats(matchId: number, clubId: number) {
    return this.prisma.matchClubStats.findUnique({
      where: {
        clubId_matchId: {
          clubId,
          matchId,
        },
      },
    });
  }
}
