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
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePlayerDto } from './dto/create-player.dto.ts';
import { UpdatePlayerDto } from './dto/update-player.dto.ts';
import { PlayerEntity } from './entities/player.entity.ts';
import { PlayersService } from './players.service.ts';

@ApiTags('Players')
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
}
