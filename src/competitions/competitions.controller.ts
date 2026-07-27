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
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CompetitionType } from '@prisma/client';
import { CompetitionsService } from './competitions.service.ts';
import { CompetitionQueryDto } from './dto/competition-query.dto.ts';
import { CreateCompetitionEditionDto } from './dto/create-competition-edition.dto.ts';
import { UpdateCompetitionEditionDto } from './dto/update-competition-edition.dto.ts';
import { CompetitionEntity } from './entities/competition.entity.ts';

@Controller('competitions')
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}
  @Get()
  @ApiOkResponse({
    type: CompetitionEntity,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Gets all competitions or filters them by type',
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
  getCompetitions(@Query() query: CompetitionQueryDto) {
    if (query.type) {
      return this.competitionsService.findCompetitionsByType(query.type);
    }

    return this.competitionsService.findCompetitions();
  }

  @Get(':id')
  @ApiOkResponse({
    type: CompetitionEntity,
  })
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

  @Post(':competitionId/editions')
  @ApiOperation({ summary: 'Create a new edition for a competition' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Edition created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'This competition already has an edition for this season.',
  })
  createCompetitionEdition(
    @Param('competitionId', ParseIntPipe) competitionId: number,
    @Body() data: CreateCompetitionEditionDto,
  ) {
    return this.competitionsService.createEdition(competitionId, data);
  }

  @Patch(':competitionId/editions/:editionId')
  @ApiOperation({
    summary: 'Assign a winner and a runner-up team to a competition edition',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teams assigned!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
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
    description: 'The winner and the runner-up teams must be different',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      "You can't assign a team that is not participating in the given competition",
  })
  @ApiBody({
    schema: {
      example: {
        winnerTeamId: 1,
        runnerUpTeamId: 2,
      },
    },
  })
  assignTeamsToCompetition(
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

  @Get('/editions/:competitionEditionId/teams')
  @ApiOperation({
    summary:
      'Get the list of teams that are participating in the given competition',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the teams',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Competition Edition not found',
  })
  getCompetitionParticipants(
    @Param('competitionEditionId', ParseIntPipe) competitionEditionId: number,
  ) {
    return this.competitionsService.findCompetitionParticipants(
      competitionEditionId,
    );
  }

  @Post('/editions/:competitionEditionId/teams/:teamId')
  @ApiOperation({
    summary: 'Register a team to a competition',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Team registered!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Competition Edition not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'This team has already been registered',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      "You can't register more teams, the maximum number has been reached",
  })
  registerParticipant(
    @Param('competitionEditionId', ParseIntPipe) competitionEditionId: number,
    @Param('teamId', ParseIntPipe) teamId: number,
  ) {
    return this.competitionsService.registerParticipant(
      competitionEditionId,
      teamId,
    );
  }

  @Put('/editions/:competitionEditionId/teams')
  @ApiOperation({
    summary:
      'Updates the entire list of teams that are participating in the given competition',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the teams',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Competition Edition not found',
  })
  @ApiBody({
    schema: {
      example: [{ teamId: 1 }, { teamId: 2 }, { teamId: 3 }],
    },
  })
  replaceCompetitionParticipants(
    @Param('competitionEditionId', ParseIntPipe) competitionEditionId: number,
    @Body() teamIds: number[],
  ) {
    return this.competitionsService.replaceCompetitionParticipants(
      competitionEditionId,
      teamIds,
    );
  }

  @Delete('/editions/:competitionEditionId/teams/:teamId')
  @ApiOperation({
    summary: 'Deletes a team from a competition',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Team deleted!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Season not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Competition Edition not found',
  })
  disqualifyParticipant(
    @Param('competitionEditionId', ParseIntPipe) competitionEditionId: number,
    @Param('teamId', ParseIntPipe) teamId: number,
  ) {
    return this.competitionsService.deleteCompetitionParticipant(
      competitionEditionId,
      teamId,
    );
  }
}
