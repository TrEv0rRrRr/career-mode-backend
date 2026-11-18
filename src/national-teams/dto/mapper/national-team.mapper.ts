import { NationalTeamWithRelations } from '../../national-teams.repository.ts';
import { NationalTeamResponseDto } from '../response/national-team-response.dto.ts';

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
}
