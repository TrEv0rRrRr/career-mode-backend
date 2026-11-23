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
  ApiResponse,
} from '@nestjs/swagger';
import { MatchResponseDto } from '../matches/dto/response/match-response.dto.ts';
import { ClubsService } from './clubs.service.ts';
import { ClubQueryDto } from './dto/club-query.dto.ts';
import { CreateClubDto } from './dto/create-club.dto.ts';
import { FireManagerDto } from './dto/managers/fire-manager.dto.ts';
import { HireManagerDto } from './dto/managers/hire-manager.dto.ts';
import { ChangePlayerJerseyNumberDto } from './dto/players/change-player-jersey-number.dto.ts';
import { ReleasePlayerDto } from './dto/players/release-player.dto.ts';
import { SignPlayerDto } from './dto/players/sign-player.dto.ts';
import {
  ClubPlayersResponseDto,
  ClubResponseDto,
  ClubSeasonStatsResponseDto,
  ClubSquadStatsResponseDto,
} from './dto/response/club-response.dto.ts';
import { UpdateClubDto } from './dto/update-club.dto.ts';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Get()
  @ApiOperation({
    summary:
      'Get all clubs or filters them by country or the league where they play at',
  })
  @ApiOkResponse({
    type: [ClubResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the clubs',
  })
  getAllClubs(@Query() query: ClubQueryDto) {
    if (query.country) {
      return this.clubsService.findClubsByCountry(query.country);
    }

    if (query.leagueId) {
      return this.clubsService.findClubsByLeague(query.leagueId);
    }

    return this.clubsService.findClubs();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a club by its id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the club',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Club not found',
  })
  getClubById(@Param('id', ParseIntPipe) id: number) {
    return this.clubsService.findClubById(id);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get a club by its name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the club',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Club not found',
  })
  getClubByName(@Param('name') name: string) {
    return this.clubsService.findClubByName(name);
  }

  @Post()
  @ApiOperation({ summary: 'Create a club' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Club created!',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'There is a club with that name already',
  })
  createClub(@Body() data: CreateClubDto) {
    return this.clubsService.createClub(data);
  }

  @Post('/many')
  @ApiOperation({ summary: 'Create as many clubs as you want' })
  @ApiBody({ type: [CreateClubDto] })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Clubs created!',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "There's a club with that name already",
  })
  createManyClubs(
    @Body(new ParseArrayPipe({ items: CreateClubDto })) data: CreateClubDto[],
  ) {
    return this.clubsService.createManyClubs(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a club' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Club updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Club not found',
  })
  updateClub(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateClubDto,
  ) {
    return this.clubsService.updateClub(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a club' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Club deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Club not found',
  })
  deleteClub(@Param('id', ParseIntPipe) id: number) {
    return this.clubsService.deleteClub(id);
  }

  // ! Player Club Endpoint

  @Get(':clubId/squad')
  @ApiOperation({
    summary: "Gets the club's current squad",
  })
  @ApiOkResponse({
    type: [ClubPlayersResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the players',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Club not found',
  })
  getCurrentSquad(@Param('clubId', ParseIntPipe) clubId: number) {
    return this.clubsService.findSquad(clubId);
  }

  @Post(':clubId/sign/:playerId')
  @ApiOperation({ summary: 'Sign a player for a club' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Player signed successfully!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Club not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'The player is already playing for a club',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The end date cannot be before the start date',
  })
  signPlayerToClub(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('playerId', ParseIntPipe) playerId: number,
    @Body() data: SignPlayerDto,
  ) {
    return this.clubsService.signPlayer(clubId, playerId, data);
  }

  @Patch(':clubId/squad/:playerId')
  @ApiOperation({ summary: 'Change the jersey number for the given player' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Player jersey number updated!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Club not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The requested number is already in use',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'This player is not playing for any club currently',
  })
  changePlayerJerseyNumber(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('playerId', ParseIntPipe) playerId: number,
    @Body() data: ChangePlayerJerseyNumberDto,
  ) {
    return this.clubsService.changePlayerJerseyNumber(clubId, playerId, data);
  }

  @Patch(':clubId/squad/:playerId/release')
  @ApiOperation({ summary: 'Release the given player from the given club' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Player released successfully!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Club not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'This player is not currently playing for a club',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The end date cannot be before the start date',
  })
  releasePlayer(
    @Param('playerId', ParseIntPipe) playerId: number,
    @Body() data: ReleasePlayerDto,
  ) {
    return this.clubsService.releasePlayer(playerId, data);
  }

  // ! Player Season Stats Endpoints

  @Get(':clubId/player-stats')
  @ApiOperation({
    summary: 'Gets the squad stats',
  })
  @ApiOkResponse({
    type: [ClubSquadStatsResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the stats',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Club not found',
  })
  getSquadStats(@Param('clubId', ParseIntPipe) clubId: number) {
    return this.clubsService.findClubPlayerStats(clubId);
  }

  @Get(':clubId/player-stats/:seasonId')
  @ApiOperation({
    summary: 'Gets the squad stats by season',
  })
  @ApiOkResponse({
    type: [ClubSquadStatsResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the stats',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Club not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Season not found',
  })
  getSquadStatsBySeason(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('seasonId', ParseIntPipe) seasonId: number,
  ) {
    return this.clubsService.findClubPlayerStatsBySeason(clubId, seasonId);
  }

  // ! Club Season Endpoints

  @Get(':clubId/club-stats')
  @ApiOperation({
    summary: 'Gets the club stats',
  })
  @ApiOkResponse({
    type: [ClubSeasonStatsResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the stats',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Club not found',
  })
  getClubStats(@Param('clubId', ParseIntPipe) clubId: number) {
    return this.clubsService.findClubStats(clubId);
  }

  @Get(':clubId/club-stats/:seasonId')
  @ApiOperation({
    summary: 'Gets the club stats by season',
  })
  @ApiOkResponse({
    type: ClubSeasonStatsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the stats',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Club not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Season not found',
  })
  getClubStatsBySeason(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('seasonId', ParseIntPipe) seasonId: number,
  ) {
    return this.clubsService.findClubStatsBySeason(clubId, seasonId);
  }

  // ! Club Matches Endpoint

  @Get(':clubId/matches')
  @ApiOperation({
    summary: 'Gets the club matches or filter them by home or away',
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
    description: 'Club not found',
  })
  getClubMatches(@Param('clubId', ParseIntPipe) clubId: number) {
    return this.clubsService.findClubMatches(clubId);
  }

  // ! Manager Club Endpoints
  @Get(':clubId/managers/current')
  @ApiOperation({
    summary: "Get the club's current manager",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Club not found',
  })
  getCurrentManager(@Param('clubId', ParseIntPipe) clubId: number) {
    return this.clubsService.findCurrentManager(clubId);
  }

  @Get(':clubId/managers/history')
  @ApiOperation({
    summary: "Get the club's manager history",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Club not found',
  })
  getManagerHistory(@Param('clubId', ParseIntPipe) clubId: number) {
    return this.clubsService.findManagerHistory(clubId);
  }

  @Post(':clubId/managers/:managerId/hire')
  @ApiOperation({
    summary: 'Hire a new manager',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Manager hired successfully!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Club not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Manager not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The manager is already managing another club',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The end date cannot be before the start date',
  })
  hireManager(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('managerId', ParseIntPipe) managerId: number,
    @Body() data: HireManagerDto,
  ) {
    return this.clubsService.hireManager(clubId, managerId, data);
  }

  @Patch(':clubId/managers/fire')
  @ApiOperation({
    summary: 'Fire the current manager',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Manager fired successfully!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Club not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'This club has no manager',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The end date cannot be before the start date',
  })
  fireManager(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() data: FireManagerDto,
  ) {
    return this.clubsService.fireManager(clubId, data);
  }

  @Put(':clubId/managers/replace/:managerId')
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
    description: 'Club not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Manager not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'This club has no manager',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The end date cannot be before the start date',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The manager is already managing another club',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The end date cannot be before the start date',
  })
  fireManagerAndHireANewOne(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('managerId', ParseIntPipe) managerId: number,
    @Body() data: HireManagerDto,
  ) {
    return this.clubsService.fireManagerAndHireANewOne(clubId, managerId, data);
  }
}
