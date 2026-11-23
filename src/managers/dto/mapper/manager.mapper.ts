import { ManagerWithRelations } from '../../managers.repository.ts';
import {
  ManagerClubResponseDto,
  ManagerClubType,
  ManagerNationalTeamResponseDto,
  ManagerNationalTeamType,
  ManagerResponseDto,
} from '../response/manager-response.dto.ts';

export type NotFoundDto = {
  message: string;
  notFound: true;
};

export class ManagerMapper {
  static toResponse(m: ManagerWithRelations): ManagerResponseDto {
    const c = m.managerClubs[0];
    const nt = m.managerNationalTeams[0];

    return {
      id: m.id,
      name: m.name,
      face: m.face,
      nationality: m.nationality,
      birthDate: m.birthDate,
      currentClub: c
        ? {
            startDate: c.startDate,
            endDate: c.endDate,
            club: {
              id: c.clubId,
              name: c.club.name,
              logo: c.club.logo,
              country: c.club.country,
            },
          }
        : null,
      currentNationalTeam: nt
        ? {
            startDate: nt.startDate,
            endDate: nt.endDate,
            nationalTeam: {
              id: nt.nationalTeamId,
              name: nt.nationalTeam.name,
              logo: nt.nationalTeam.logo,
            },
          }
        : null,
    };
  }

  static mapClubs(
    mc: ManagerClubType | null,
  ): ManagerClubResponseDto | NotFoundDto {
    if (!mc)
      return {
        message: 'This manager is not currently managing any team',
        notFound: true,
      };
    return {
      id: mc.id,
      startDate: mc.startDate,
      endDate: mc.endDate,
      club: {
        id: mc.clubId,
        name: mc.club.name,
        logo: mc.club.logo,
        country: mc.club.country,
      },
    };
  }

  static mapNationalTeams(
    mnt: ManagerNationalTeamType | null,
  ): ManagerNationalTeamResponseDto | NotFoundDto {
    if (!mnt)
      return {
        message: 'This manager is not currently managing any nt',
        notFound: true,
      };
    return {
      id: mnt.id,
      startDate: mnt.startDate,
      endDate: mnt.endDate,
      nationalTeam: {
        id: mnt.nationalTeamId,
        name: mnt.nationalTeam.name,
        logo: mnt.nationalTeam.logo,
      },
    };
  }
}
