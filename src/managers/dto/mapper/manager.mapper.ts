import {
  ManagerClubResponseDto,
  ManagerClubType,
  ManagerNationalTeamResponseDto,
  ManagerNationalTeamType,
} from '../response/manager-response.dto.ts';

export class ManagerMapper {
  static mapClubs(mc: ManagerClubType): ManagerClubResponseDto {
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
    mnt: ManagerNationalTeamType,
  ): ManagerNationalTeamResponseDto {
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
