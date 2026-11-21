import {
  ManagerNationalTeamResponseDto,
  ManagerNationalTeamType,
  ManagerTeamResponseDto,
  ManagerTeamType,
} from '../response/manager-response.dto.ts';

export class ManagerMapper {
  static mapTeams(mt: ManagerTeamType): ManagerTeamResponseDto {
    return {
      id: mt.id,
      startDate: mt.startDate,
      endDate: mt.endDate,
      team: {
        id: mt.teamId,
        name: mt.team.name,
        logo: mt.team.logo,
        country: mt.team.country,
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
