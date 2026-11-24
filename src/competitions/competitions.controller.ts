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
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CompetitionFormat, CompetitionType } from '@prisma/client';
import { MatchResponseDto } from '../matches/dto/response/match-response.dto.ts';
import { CompetitionsService } from './competitions.service.ts';
import { ChangeEditionFinalStadiumDto } from './dto/change-edition-final-stadium.dto.ts';
import { CompetitionQueryDto } from './dto/competition-query.dto.ts';
import { CreateCompetitionGroupsDto } from './dto/create-competition-groups.dto.ts';
import { CreateManyEditionsDto } from './dto/create-many-editions.dto.ts';
import { UpdateCompetitionEditionDto } from './dto/update-competition-edition.dto.ts';
import { CompetitionFixtureService } from './services/competition-fixture.service.ts';

@Controller('competitions')
export class CompetitionsController {
  constructor(
    private readonly competitionsService: CompetitionsService,
    private readonly competitionFixtureService: CompetitionFixtureService,
  ) {}
  @Get()
  @ApiOperation({
    summary: 'Gets all competitions or filters them by type or format',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the competitions',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: CompetitionType,
    description: 'Filter competitions by type',
  })
  @ApiQuery({
    name: 'format',
    required: false,
    enum: CompetitionFormat,
    description: 'Filter competitions by format',
  })
  getCompetitions(@Query() query: CompetitionQueryDto) {
    if (query.type) {
      return this.competitionsService.findCompetitionsByType(query.type);
    }

    if (query.format) {
      return this.competitionsService.findCompetitionsByFormat(query.format);
    }

    return this.competitionsService.findCompetitions();
  }

  @Get(':id')
  @ApiOperation({ summary: "Gets a competition by it's id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the competition',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Competition not found',
  })
  getCompetition(@Param('id', ParseIntPipe) id: number) {
    return this.competitionsService.findCompetitionById(id);
  }

  // ! Competition Edition Endpoints

  @Get(':competitionId/editions')
  @ApiOperation({
    summary: 'Gets all the editions of a competition',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the editions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Competition not found',
  })
  getEditionsByCompetition(
    @Param('competitionId', ParseIntPipe) competitionId: number,
  ) {
    return this.competitionsService.findEditionsByCompetition(competitionId);
  }

  @Get('/editions/:editionId')
  @ApiOperation({
    summary: 'Get an specific edition',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the edition',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Competition not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Edition not found',
  })
  getCompetitionEditionById(
    @Param('editionId', ParseIntPipe) editionId: number,
  ) {
    return this.competitionsService.findCompetitionEditionById(editionId);
  }

  @Get(':competitionId/editions/season/:seasonId')
  @ApiOperation({
    summary: 'Get an specific edition by competition and season',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the edition',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Competition not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Season not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Season not found',
  })
  getEditionByCompetitionAndSeason(
    @Param('competitionId', ParseIntPipe) competitionId: number,
    @Param('seasonId', ParseIntPipe) seasonId: number,
  ) {
    return this.competitionsService.findEditionByCompetitionAndSeason(
      competitionId,
      seasonId,
    );
  }

  @Get('/editions/season/current')
  @ApiOperation({
    summary: 'Get all the editions that are being played in the current season',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the editions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Season not found',
  })
  getEditionsOfTheCurrentSeason() {
    return this.competitionsService.findEditionsOfTheCurrentSeason();
  }

  @Get('/editions/season/:seasonId')
  @ApiOperation({
    summary: 'Get all the editions that are being played in the given season',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the editions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Season not found',
  })
  getEditionsBySeason(@Param('seasonId', ParseIntPipe) seasonId: number) {
    return this.competitionsService.findEditionsBySeason(seasonId);
  }

  @Post('/editions/season/current/create')
  @ApiOperation({ summary: 'Create new editions for the current season' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Edition created',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Season not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      "There's a competition with an edition already created for the current season",
  })
  @ApiBody({
    schema: {
      example: [
        {
          competitionId: 1,
        },
        {
          competitionId: 6,
          finalStadiumId: 1,
        },
      ],
    },
  })
  createEditionsForTheCurrentSeason(@Body() data: CreateManyEditionsDto[]) {
    return this.competitionsService.createEditionsForTheCurrentSeason(data);
  }

  @Patch('/editions/:editionId/final-stadium')
  @ApiOperation({
    summary: 'Change the edition final stadium for another, if available',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Stadium changed',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Edition not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Stadium not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'This stadium is already set for another competition edition',
  })
  changeEditionFinalStadium(
    @Param('editionId', ParseIntPipe) editionId: number,
    @Body() data: ChangeEditionFinalStadiumDto,
  ) {
    return this.competitionsService.changeEditionFinalStadium(editionId, data);
  }

  @Patch(':competitionId/editions/:editionId')
  @ApiOperation({
    summary:
      'Assign a winner and a runner-up club or national team to a competition edition',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Winners assigned!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Club not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Competition not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Edition not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'The winner and the runner-up participants must be different',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      "You can't assign a participant that is not participating in the given competition",
  })
  @ApiBody({
    schema: {
      oneOf: [
        {
          type: 'object',
          properties: {
            winnerClubId: { type: 'integer', minimum: 1 },
            runnerUpClubId: { type: 'integer', minimum: 1 },
          },
          required: ['winnerClubId', 'runnerUpClubId'],
        },
        {
          type: 'object',
          properties: {
            winnerNationalTeamId: { type: 'integer', minimum: 1 },
            runnerUpNationalTeamId: { type: 'integer', minimum: 1 },
          },
          required: ['winnerNationalTeamId', 'runnerUpNationalTeamId'],
        },
      ],
    },
    examples: {
      clubs: {
        summary: 'Club competition',
        value: { winnerClubId: 1, runnerUpClubId: 2 },
      },
      nationalTeams: {
        summary: 'National teams competition',
        value: { winnerNationalTeamId: 1, runnerUpNationalTeamId: 2 },
      },
    },
  })
  assignClubsToCompetition(
    @Param('competitionId', ParseIntPipe) competitionId: number,
    @Param('editionId', ParseIntPipe) editionId: number,
    @Body() data: UpdateCompetitionEditionDto,
  ) {
    return this.competitionsService.assignWinnerAndRunnerUp(
      competitionId,
      editionId,
      data,
    );
  }

  // ! Competition Participant Endpoints

  @Get('/editions/:competitionEditionId/clubs')
  @ApiOperation({
    summary:
      'Get the list of participants that are participating in the given competition',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the competition participants',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Participant not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Competition Edition not found',
  })
  getCompetitionParticipants(
    @Param('competitionEditionId', ParseIntPipe) competitionEditionId: number,
  ) {
    return this.competitionsService.findAllCompetitionParticipants(
      competitionEditionId,
    );
  }

  @Get('/editions/:competitionEditionId/standings')
  @ApiOperation({
    summary: 'Get the standings of a league competition edition',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'League standings retrieved!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Competition Edition not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Standings are only available for league competitions.',
  })
  getLeagueStandings(
    @Param('competitionEditionId', ParseIntPipe) competitionEditionId: number,
  ) {
    return this.competitionsService.findLeagueStandings(competitionEditionId);
  }

  @Post('/editions/:competitionEditionId/clubs')
  @ApiOperation({
    summary:
      'Register participants to a competition (clubs, or national teams for NATIONAL_TEAMS competitions)',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Participants registered!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Participant not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Competition Edition not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'A club has already been registered',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      "You can't register more clubs, the maximum number has been reached",
  })
  @ApiBody({
    schema: {
      example: [1, 2, 3],
    },
  })
  registerParticipant(
    @Param('competitionEditionId', ParseIntPipe) competitionEditionId: number,
    @Body() participantIds: number[],
  ) {
    return this.competitionsService.registerParticipant(
      competitionEditionId,
      participantIds,
    );
  }

  @Put('/editions/:competitionEditionId/clubs')
  @ApiOperation({
    summary: 'Updates the entire list of participants for a competition',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updates the competition participants',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Participant not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Competition Edition not found',
  })
  @ApiBody({
    schema: {
      example: [1, 2, 3],
    },
  })
  replaceCompetitionParticipants(
    @Param('competitionEditionId', ParseIntPipe) competitionEditionId: number,
    @Body() participantIds: number[],
  ) {
    return this.competitionsService.replaceCompetitionParticipants(
      competitionEditionId,
      participantIds,
    );
  }

  @Delete('/editions/:competitionEditionId/clubs/:clubId')
  @ApiOperation({
    summary: 'Deletes a participant from a competition',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Club deleted!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Season not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Participant not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Competition Edition not found',
  })
  disqualifyParticipant(
    @Param('competitionEditionId', ParseIntPipe) competitionEditionId: number,
    @Param('clubId', ParseIntPipe) clubId: number,
  ) {
    return this.competitionsService.deleteCompetitionParticipant(
      competitionEditionId,
      clubId,
    );
  }

  @Post('editions/:competitionEditionId/generate-fixtures')
  @ApiOperation({
    summary: 'Create a league fixture or a super cup match',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Fixture created!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Edition not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'To generate a fixture, you have to register at least 2 clubs in a competition',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Only league and super cup fixtures are generated by this endpoint. Create knockout matches through knockout-round pairings.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'The fixture has already been generated for this competition edition.',
  })
  generateCompetitionFixture(
    @Param('competitionEditionId', ParseIntPipe) competitionEditionId: number,
  ) {
    return this.competitionFixtureService.generateCompetitionFixture(
      competitionEditionId,
    );
  }

  @Post('/editions/:competitionEditionId/groups')
  @ApiOperation({
    summary: 'Create group-stage matches for a competition edition',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Group-stage matches created!',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Groups can only be created for GROUPS_AND_KNOCKOUT competitions.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'At least one group must be provided.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Every group must have a name and at least one club.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Every participating club must be assigned to exactly one group.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Matches already exist for this competition edition.',
  })
  createCompetitionGroups(
    @Param('competitionEditionId', ParseIntPipe) competitionEditionId: number,
    @Body() data: CreateCompetitionGroupsDto,
  ) {
    return this.competitionFixtureService.createCompetitionGroups(
      competitionEditionId,
      data.groups,
    );
  }

  @Get(':competitionId/edition/:competitionEditionId/groups')
  @ApiOperation({
    summary: 'Get groups and standings for a competition edition',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Competition groups and standings retrieved!',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Groups are only available for GROUPS_AND_KNOCKOUT competitions.',
  })
  getCompetitionGroups(
    @Param('competitionId', ParseIntPipe) competitionId: number,
    @Param('competitionEditionId', ParseIntPipe) competitionEditionId: number,
  ) {
    return this.competitionsService.findCompetitionGroups(
      competitionId,
      competitionEditionId,
    );
  }

  @Get('/editions/:competitionEditionId/matches')
  @ApiOperation({ summary: 'Gets the fixture of a competition' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Fixture retrieved!',
    type: [MatchResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Competition Edition not found',
  })
  getCompetitionFixture(
    @Param('competitionEditionId', ParseIntPipe) competitionEditionId: number,
  ) {
    return this.competitionsService.findCompetitionEditionMatches(
      competitionEditionId,
    );
  }
}
