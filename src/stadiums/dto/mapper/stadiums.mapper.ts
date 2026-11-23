import { StadiumWithRelations } from '../../stadiums.repository.ts';
import { StadiumResponseDto } from '../response/stadiums.response.ts';

export class StadiumMapper {
  static toResponse(s: StadiumWithRelations): StadiumResponseDto {
    const club = s.clubs[0];
    const nt = s.nationalTeams[0];

    const haveHomeClub = s.clubs.length !== 0;
    const haveHomeNT = s.nationalTeams.length !== 0;

    return {
      id: s.id,
      name: s.name,
      country: s.country,
      image: s.image,
      capacity: s.capacity,
      openingDate: s.openingDate,
      ...(haveHomeClub && {
        homeClub: {
          id: club.id,
          name: club.name,
          logo: club.logo,
          country: club.country,
          confederation: club.confederation,
        },
      }),
      ...(haveHomeNT && {
        homeNationalTeam: {
          id: nt.id,
          name: nt.name,
          logo: nt.logo,
          confederation: nt.confederation,
        },
      }),
    };
  }
}
