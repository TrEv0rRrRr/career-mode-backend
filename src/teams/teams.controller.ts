import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTeamDto } from './dto/create-team.dto.ts';
import { TeamQueryDto } from './dto/team-query.dto.ts';
import { UpdateTeamDto } from './dto/update-team.dto.ts';
import { TeamEntity } from './entities/team.entity.ts';
import { TeamsService } from './teams.service.ts';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @ApiOkResponse({
    type: TeamEntity,
    isArray: true,
  })
  @ApiOperation({
    summary:
      'Get all teams or filters them by country or the league where they play at',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the teams',
  })
  getAllTeams(@Query() query: TeamQueryDto) {
    if (query.country) {
      return this.teamsService.findTeamsByCountry(query.country);
    }

    if (query.leagueId) {
      return this.teamsService.findTeamsByLeague(query.leagueId);
    }

    return this.teamsService.findTeams();
  }

  @Get(':id')
  @ApiOkResponse({
    type: TeamEntity,
  })
  @ApiOperation({ summary: 'Get a team by its id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the team',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  getTeamById(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findTeamById(id);
  }

  @Get('name/:name')
  @ApiOkResponse({
    type: TeamEntity,
  })
  @ApiOperation({ summary: 'Get a team by its name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the team',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  getTeamByName(@Param('name') name: string) {
    return this.teamsService.findTeamByName(name);
  }

  @Post()
  @ApiOperation({ summary: 'Create a team' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Team created!',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'There is a team with that name already',
  })
  createTeam(@Body() data: CreateTeamDto) {
    return this.teamsService.createTeam(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a team' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Team updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  updateTeam(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTeamDto,
  ) {
    return this.teamsService.updateTeam(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a team' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Team deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  deleteTeam(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.deleteTeam(id);
  }
}
