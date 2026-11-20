import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CallUpPlayerDto } from './dto/nts/callup-player.dto.ts';
import { DismissPlayerDto } from './dto/nts/dismiss-player.dto.ts';
import { CreatePlayerDto } from './dto/player/create-player.dto.ts';
import { UpdatePlayerDto } from './dto/player/update-player.dto.ts';
import { AssignPositionsDto } from './dto/positions/assign-positions.dto.ts';
import { UpdatePlayerPositionDto } from './dto/positions/update-player-position.dto.ts';
import {
  PlayerPositionsResponseDto,
  PlayerResponseDto,
  PlayerTeamsResponseDto,
} from './dto/response/player-response.dto.ts';
import { AssignTeamDto } from './dto/teams/assign-team.dto.ts';
import { UpdatePlayerTeamDto } from './dto/teams/update-player-team.dto.ts';
import { PlayersService } from './players.service.ts';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}
  // ! Player Endpoints

  @Get()
  @ApiOperation({ summary: 'Get all players' })
  @ApiOkResponse({
    type: [PlayerResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the players',
  })
  getAllPlayers() {
    return this.playersService.findPlayers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a player by its id' })
  @ApiOkResponse({
    type: PlayerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the player',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  getPlayerById(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.findPlayerById(id);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get a player by its name' })
  @ApiOkResponse({
    type: PlayerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the player',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  getPlayerByName(@Param('name') name: string) {
    return this.playersService.findPlayerByName(name);
  }

  @Post()
  @ApiOperation({ summary: 'Create a player' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Player created!',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'There is a player with that name already',
  })
  createPlayer(@Body() data: CreatePlayerDto) {
    return this.playersService.createPlayer(data);
  }

  @Post('/many')
  @ApiOperation({ summary: 'Create as many players as you want' })
  @ApiBody({ type: [CreatePlayerDto] })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Player created!',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "There's a player with that name already",
  })
  createManyPlayers(
    @Body(new ParseArrayPipe({ items: CreatePlayerDto }))
    data: CreatePlayerDto[],
  ) {
    return this.playersService.createManyPlayers(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a player' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Player updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  updatePlayer(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePlayerDto,
  ) {
    return this.playersService.updatePlayer(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a player' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Player deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  deletePlayer(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.deletePlayer(id);
  }

  // ! Player Position Endpoints

  @Get(':playerId/positions')
  @ApiOperation({ summary: "Get all player's position" })
  @ApiOkResponse({
    type: [PlayerPositionsResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Player positions found!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  getAllPlayerPositions(@Param('playerId', ParseIntPipe) playerId: number) {
    return this.playersService.findPlayerPositions(playerId);
  }

  @Post(':playerId/positions')
  @ApiOperation({ summary: 'Assign positions to a player' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Positions assigned!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  assignPlayerPositions(
    @Param('playerId', ParseIntPipe) playerId: number,
    @Body() data: AssignPositionsDto,
  ) {
    return this.playersService.assignPositions(playerId, data);
  }

  @Put(':playerId/positions')
  @ApiOperation({ summary: "Updates all player's position" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Player positions replaced!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  @ApiBody({
    schema: {
      example: [
        {
          positionId: 11,
          isPrimary: true,
        },
        {
          positionId: 9,
          isPrimary: false,
        },
      ],
    },
  })
  replacePlayerPositions(
    @Param('playerId', ParseIntPipe) playerId: number,
    @Body() data: AssignPositionsDto[],
  ) {
    return this.playersService.replacePlayerPositions(playerId, data);
  }

  @Patch(':playerId/positions/:positionId')
  @ApiOperation({ summary: "Update a player's position assignment" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Player position updated!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  updatePlayerPosition(
    @Param('playerId', ParseIntPipe) playerId: number,
    @Param('positionId', ParseIntPipe) positionId: number,
    @Body() data: UpdatePlayerPositionDto,
  ) {
    return this.playersService.updatePlayerPosition(playerId, positionId, data);
  }

  @Delete(':playerId/positions/:positionId')
  @ApiOperation({ summary: "Deletes a player's position" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Player position deleted!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  deletePlayerPosition(
    @Param('playerId', ParseIntPipe) playerId: number,
    @Param('positionId', ParseIntPipe) positionId: number,
  ) {
    return this.playersService.deletePlayerPosition(playerId, positionId);
  }

  // ! Player Team Endpoints

  @Get(':playerId/teams')
  @ApiOperation({ summary: "Get a player's teams record" })
  @ApiOkResponse({
    type: [PlayerTeamsResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Player teams found!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  getAllPlayerTeams(@Param('playerId', ParseIntPipe) playerId: number) {
    return this.playersService.findPlayerTeams(playerId);
  }

  @Post(':playerId/teams')
  @ApiOperation({ summary: 'Sign a player for a team' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Player signed for that team!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'The player is already playing for a team',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The end date cannot be before the start date',
  })
  signPlayerToTeam(
    @Param('playerId', ParseIntPipe) playerId: number,
    @Body() data: AssignTeamDto,
  ) {
    return this.playersService.assignTeam(playerId, data);
  }

  @Put(':playerId/teams')
  @ApiOperation({ summary: "Update a player's teams record" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Player teams replaced!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'The player is already playing for a team',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The end date cannot be before the start date',
  })
  @ApiBody({
    schema: {
      example: [
        {
          teamId: 1,
          jerseyNumber: 10,
          startDate: '2026-07-21',
          endDate: '2030-07-21',
        },
        {
          teamId: 2,
          jerseyNumber: 10,
          startDate: '2030-08-21',
          endDate: null,
        },
      ],
    },
  })
  replacePlayerTeams(
    @Param('playerId', ParseIntPipe) playerId: number,
    @Body() data: AssignTeamDto[],
  ) {
    return this.playersService.replacePlayerTeams(playerId, data);
  }

  @Patch(':playerId/teams/:playerTeamId')
  @ApiOperation({ summary: "Update a player's team" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Player team update!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The end date cannot be before the start date',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid start date.',
  })
  updatePlayerTeam(
    @Param('playerId', ParseIntPipe) playerId: number,
    @Param('playerTeamId', ParseIntPipe) playerTeamId: number,
    @Body() data: UpdatePlayerTeamDto,
  ) {
    return this.playersService.updatePlayerTeam(playerId, playerTeamId, data);
  }

  @Delete(':playerId/teams/:playerTeamId')
  @ApiOperation({ summary: "Delete a player's team" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Player team deleted!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid start date.',
  })
  deletePlayerTeam(
    @Param('playerId', ParseIntPipe) playerId: number,
    @Param('playerTeamId', ParseIntPipe) playerTeamId: number,
  ) {
    return this.playersService.deletePlayerTeam(playerTeamId, playerId);
  }

  // ! Player season stats Endpoints

  @Get(':playerId/stats')
  @ApiOperation({ summary: "Get the player's stats from all seasons" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Stats retrieved!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  getPlayerSeasonStats(@Param('playerId', ParseIntPipe) playerId: number) {
    return this.playersService.findPlayerSeasonStats(playerId);
  }

  @Get(':playerId/team/:teamId/stats/:seasonId')
  @ApiOperation({
    summary: "Get the player's stats from a specific team of a specific season",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Stats retrieved!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Season not found',
  })
  getPlayerTeamSeasonStats(
    @Param('playerId', ParseIntPipe) playerId: number,
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('seasonId', ParseIntPipe) seasonId: number,
  ) {
    return this.playersService.findPlayerTeamSeasonStats(
      playerId,
      teamId,
      seasonId,
    );
  }

  // ! Player NT Endpoints
  @Get(':playerId/national-team/call-up/history')
  @ApiOperation({
    summary: "Get the player's call-up history",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'History retrieved!',
  })
  getPlayerCallUpHistory(@Param('playerId', ParseIntPipe) playerId: number) {
    return this.playersService.findPlayerCallUpHistory(playerId);
  }

  @Get(':playerId/national-team/current')
  @ApiOperation({
    summary: "Get the player's current call up",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'National Team retrieved!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  getPlayerCurrentCallUp(@Param('playerId', ParseIntPipe) playerId: number) {
    return this.playersService.findPlayerCurrentCallUp(playerId);
  }

  @Post(':playerId/national-team/:nationalTeamId/call-up')
  @ApiOperation({
    summary: 'Call Up a player to its national team',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Player called up successfully!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'National Team not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The player is already called up for a national team',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The player cannot be called up for this national team',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The end date cannot be before the start date',
  })
  callUpPlayer(
    @Param('playerId', ParseIntPipe) playerId: number,
    @Param('nationalTeamId', ParseIntPipe) nationalTeamId: number,
    @Body() data: CallUpPlayerDto,
  ) {
    return this.playersService.callUpPlayer(playerId, nationalTeamId, data);
  }

  @Patch(':playerId/national-team/dismiss')
  @ApiOperation({
    summary: 'Dismiss a player from its national team',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Player dismissed!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The player is not currently called up for a national team',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The end date cannot be before the start date',
  })
  dismissPlayer(
    @Param('playerId', ParseIntPipe) playerId: number,
    @Body() data: DismissPlayerDto,
  ) {
    return this.playersService.dismissPlayer(playerId, data);
  }
}
