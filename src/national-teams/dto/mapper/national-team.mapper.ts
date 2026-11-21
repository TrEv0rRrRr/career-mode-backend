import { NationalTeamWithRelations } from '../../national-teams.repository.ts';
import {
  CurrentCallUpPlayersResponseDto,
  CurrentManagerResponseDto,
  ManagerNationalTeam,
  NationalTeamResponseDto,
  PlayerNationalTeam,
} from '../response/national-team-response.dto.ts';

export class NationalTeamMapper {
  static toResponse(nt: NationalTeamWithRelations): NationalTeamResponseDto {
    console.log(nt);
    let manager: string | null = null;

    if (nt.managerNationalTeams.length === 0) manager = null;
    else manager = nt.managerNationalTeams[0].manager.name;

    return {
      id: nt.id,
      name: nt.name,
      logo: nt.logo,
      manager,
      stadium: nt.stadium.name,
      confederation: nt.confederation,
    };
  }

  static calledUpPlayersToResponse(
    pnt: PlayerNationalTeam,
  ): CurrentCallUpPlayersResponseDto {
    return {
      jerseyNumber: pnt.jerseyNumber,
      startDate: pnt.startDate,
      player: pnt.player,
    };
  }

  static mapManagers(mnt: ManagerNationalTeam): CurrentManagerResponseDto {
    return {
      id: mnt.id,
      nationalTeamId: mnt.nationalTeamId,
      startDate: mnt.startDate,
      endDate: mnt.endDate,
      manager: {
        id: mnt.managerId,
        name: mnt.manager.name,
        face: mnt.manager.face,
        nationality: mnt.manager.nationality,
      },
    };
  }
}
