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
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AssignPositionsDto } from './dto/assign-positions.dto.ts';
import { CreatePlayerDto } from './dto/create-player.dto.ts';
import { UpdatePlayerPositionDto } from './dto/update-player-position.dto.ts';
import { UpdatePlayerDto } from './dto/update-player.dto.ts';
import { PlayerPositionsEntity } from './entities/player-positions.entity.ts';
import { PlayerEntity } from './entities/player.entity.ts';
import { PlayersService } from './players.service.ts';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  @ApiOkResponse({
    type: PlayerEntity,
    isArray: true,
  })
  @ApiOperation({ summary: 'Get all players' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the players',
  })
  getAllPlayers() {
    return this.playersService.findPlayers();
  }

  @Get(':id')
  @ApiOkResponse({
    type: PlayerEntity,
  })
  @ApiOperation({ summary: 'Get a player by its id' })
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
  @ApiOkResponse({
    type: PlayerEntity,
  })
  @ApiOperation({ summary: 'Get a player by its name' })
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

  @Get(':playerId/positions')
  @ApiOkResponse({
    type: PlayerPositionsEntity,
    isArray: true,
  })
  @ApiOperation({ summary: "Get all player's position" })
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
    status: HttpStatus.OK,
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
}
