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
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Confederation } from '@prisma/client';
import { FireManagerDto } from '../clubs/dto/managers/fire-manager.dto.ts';
import { HireManagerDto } from '../clubs/dto/managers/hire-manager.dto.ts';
import { MatchResponseDto } from '../matches/dto/response/match-response.dto.ts';
import { CreateNationalTeamDto } from './dto/create-national-team.dto.ts';
import { NationalTeamQueryDto } from './dto/national-team-query.dto.ts';
import { CallUpPlayerDto } from './dto/players/callup-player.dto.ts';
import { DismissPlayerDto } from './dto/players/dismiss-player.dto.ts';
import { UpdateNationalTeamDto } from './dto/update-national-team.dto.ts';
import { NationalTeamsService } from './national-teams.service.ts';

@Controller('national-teams')
export class NationalTeamsController {
  constructor(private readonly nationalTeamsService: NationalTeamsService) {}

  @Get()
  @ApiOperation({
    summary: 'Gets all the NTs o filters them by confederation',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'NTs retrieved!',
  })
  @ApiQuery({
    name: 'confederation',
    required: false,
    enum: Confederation,
    description: 'Filter NTs by confederation',
  })
  getAllNationalTeams(@Query() query: NationalTeamQueryDto) {
    if (query.confederation) {
      return this.nationalTeamsService.findNationalTeamsByConfederation(
        query.confederation,
      );
    }
    return this.nationalTeamsService.findAllNationalTeams();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Gets a team by its id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'NT retrieved!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'NT not found',
  })
  getNationalTeamById(@Param('id', ParseIntPipe) id: number) {
    return this.nationalTeamsService.findNationalTeamById(id);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get a nt by its name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'NT retrieved!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'NT not found',
  })
  getTeamByName(@Param('name') name: string) {
    return this.nationalTeamsService.findNationalTeamByName(name);
  }

  @Post()
  @ApiOperation({ summary: 'Create a NT' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'NT created!',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'There is a nt with that name already',
  })
  createNationalTeam(@Body() data: CreateNationalTeamDto) {
    return this.nationalTeamsService.createNationalTeam(data);
  }

  @Post('/many')
  @ApiOperation({ summary: 'Create as many nts as you want' })
  @ApiBody({ type: [CreateNationalTeamDto] })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'NTs created!',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "There's a nt with that name already",
  })
  createManyTeams(
    @Body(new ParseArrayPipe({ items: CreateNationalTeamDto }))
    data: CreateNationalTeamDto[],
  ) {
    return this.nationalTeamsService.createManyNationalTeams(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a nt' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'NT updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'NT not found',
  })
  updateNationalTeam(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateNationalTeamDto,
  ) {
    return this.nationalTeamsService.updateNationalTeam(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a NT' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'NT deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'NT not found',
  })
  deleteTeam(@Param('id', ParseIntPipe) id: number) {
    return this.nationalTeamsService.deleteNationalTeam(id);
  }

  // ! National NT Matches Endpoint

  @Get(':nationalTeamId/matches')
  @ApiOperation({
    summary: 'Gets the nt matches or filter them by home or away',
  })
  @ApiOkResponse({
    type: [MatchResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Matches retrieved',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'NT not found',
  })
  getNationalTeamMatches(
    @Param('nationalTeamId', ParseIntPipe) nationalTeamId: number,
  ) {
    return this.nationalTeamsService.findNationalTeamMatches(nationalTeamId);
  }

  // ! National NT Players Endpoint

  @Get(':nationalTeamId/players')
  @ApiOperation({
    summary: 'Gets the players that are currently playing for the given nt',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the players',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'NT not found',
  })
  getCalledUpPlayers(
    @Param('nationalTeamId', ParseIntPipe) nationalTeamId: number,
  ) {
    return this.nationalTeamsService.findCalledUpPlayers(nationalTeamId);
  }

  @Post(':nationalTeamId/call-up/:playerId')
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
    return this.nationalTeamsService.callUpPlayer(
      playerId,
      nationalTeamId,
      data,
    );
  }

  @Patch('dismiss/:playerId')
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
    return this.nationalTeamsService.dismissPlayer(playerId, data);
  }

  // ! Manager National NT Endpoints

  @Get(':nationalTeamId/managers/current')
  @ApiOperation({
    summary: "Get the nt's current manager",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'NT not found',
  })
  getCurrentManager(
    @Param('nationalTeamId', ParseIntPipe) nationalTeamId: number,
  ) {
    return this.nationalTeamsService.findCurrentManager(nationalTeamId);
  }

  @Get(':nationalTeamId/managers/history')
  @ApiOperation({
    summary: "Get the nt's manager history",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'NT not found',
  })
  getManagerHistory(
    @Param('nationalTeamId', ParseIntPipe) nationalTeamId: number,
  ) {
    return this.nationalTeamsService.findManagerHistory(nationalTeamId);
  }

  @Post(':nationalTeamId/managers/:managerId/hire')
  @ApiOperation({
    summary: 'Hire a new manager',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Manager hired successfully!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'NT not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Manager not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The manager is already managing another nt',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The end date cannot be before the start date',
  })
  hireManager(
    @Param('nationalTeamId', ParseIntPipe) nationalTeamId: number,
    @Param('managerId', ParseIntPipe) managerId: number,
    @Body() data: HireManagerDto,
  ) {
    return this.nationalTeamsService.hireManager(
      nationalTeamId,
      managerId,
      data,
    );
  }

  @Patch(':nationalTeamId/managers/fire')
  @ApiOperation({
    summary: 'Fire the current manager',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Manager fired successfully!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'NT not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'This nt has no manager',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The end date cannot be before the start date',
  })
  fireManager(
    @Param('nationalTeamId', ParseIntPipe) nationalTeamId: number,
    @Body() data: FireManagerDto,
  ) {
    return this.nationalTeamsService.fireManager(nationalTeamId, data);
  }

  @Put(':nationalTeamId/managers/replace/:managerId')
  @ApiOperation({
    summary: 'Fire the current manager and immediately hire a new one',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'The current manager was fired successfully and a new one was hired.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'NT not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Manager not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'This nt has no manager',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The end date cannot be before the start date',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The manager is already managing another nt',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The end date cannot be before the start date',
  })
  fireManagerAndHireANewOne(
    @Param('nationalTeamId', ParseIntPipe) nationalTeamId: number,
    @Param('managerId', ParseIntPipe) managerId: number,
    @Body() data: HireManagerDto,
  ) {
    return this.nationalTeamsService.fireManagerAndHireANewOne(
      nationalTeamId,
      managerId,
      data,
    );
  }
}
