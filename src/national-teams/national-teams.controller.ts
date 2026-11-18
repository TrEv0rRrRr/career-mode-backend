import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateNationalTeamDto } from './dto/create-national-team.dto.ts';
import { UpdateNationalTeamDto } from './dto/update-national-team.dto.ts';
import { NationalTeamsService } from './national-teams.service.ts';

@Controller('national-teams')
export class NationalTeamsController {
  constructor(private readonly nationalTeamsService: NationalTeamsService) {}

  @Post()
  create(@Body() createNationalTeamDto: CreateNationalTeamDto) {
    return this.nationalTeamsService.create(createNationalTeamDto);
  }

  @Get()
  findAll() {
    return this.nationalTeamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.nationalTeamsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNationalTeamDto: UpdateNationalTeamDto,
  ) {
    return this.nationalTeamsService.update(id, updateNationalTeamDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.nationalTeamsService.remove(id);
  }
}
