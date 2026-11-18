import { Injectable } from '@nestjs/common';
import { CreateNationalTeamDto } from './dto/create-national-team.dto.ts';
import { UpdateNationalTeamDto } from './dto/update-national-team.dto.ts';

@Injectable()
export class NationalTeamsService {
  create(createNationalTeamDto: CreateNationalTeamDto) {
    return 'This action adds a new nationalTeam';
  }

  findAll() {
    return `This action returns all nationalTeams`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nationalTeam`;
  }

  update(id: number, updateNationalTeamDto: UpdateNationalTeamDto) {
    return `This action updates a #${id} nationalTeam`;
  }

  remove(id: number) {
    return `This action removes a #${id} nationalTeam`;
  }
}
