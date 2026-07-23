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

  // ! Player Team Endpoint

  @Get(':teamId/players')
  @ApiOperation({
    summary: 'Gets the players that are currently playing for the given team',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the players',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  getTeamPlayers(@Param('teamId', ParseIntPipe) teamId: number) {
    return this.teamsService.findPlayers(teamId);
  }

  // ! Player Season Stats Endpoints

  @Get(':teamId/player-stats')
  @ApiOperation({
    summary: 'Gets the squad stats',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the stats',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  getSquadStats(@Param('teamId', ParseIntPipe) teamId: number) {
    return this.teamsService.findTeamPlayerStats(teamId);
  }

  @Get(':teamId/player-stats/:seasonId')
  @ApiOperation({
    summary: 'Gets the squad stats by season',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the stats',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Season not found',
  })
  getSquadStatsBySeason(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('seasonId', ParseIntPipe) seasonId: number,
  ) {
    return this.teamsService.findTeamPlayerStatsBySeason(teamId, seasonId);
  }

  // ! Team Season Endpoints

  @Get(':teamId/team-stats')
  @ApiOperation({
    summary: 'Gets the team stats',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the stats',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  getTeamStats(@Param('teamId', ParseIntPipe) teamId: number) {
    return this.teamsService.findTeamStats(teamId);
  }

  @Get(':teamId/team-stats/:seasonId')
  @ApiOperation({
    summary: 'Gets the team stats by season',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the stats',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Season not found',
  })
  getTeamStatsBySeason(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('seasonId', ParseIntPipe) seasonId: number,
  ) {
    return this.teamsService.findTeamStatsBySeason(teamId, seasonId);
  }
}
