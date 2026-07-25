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

  @Get(':competitionId/editions/:editionId')
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
    @Param('competitionId', ParseIntPipe) competitionId: number,
    @Param('editionId', ParseIntPipe) editionId: number,
  ) {
    return this.competitionsService.findCompetitionEditionById(
      competitionId,
      editionId,
    );
  }

  @Post(':competitionId')
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

  @Patch(':editionId')
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

  // ! Team Season Endpoints

  @Get(':competitionId/season/:seasonId/teams')
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
    description: 'Competition not found',
  })
  getCompetitionTeams(
    @Param('competitionId', ParseIntPipe) competitionId: number,
    @Param('seasonId', ParseIntPipe) seasonId: number,
  ) {
    return this.competitionsService.findCompetitionTeams(
      competitionId,
      seasonId,
    );
  }

  @Post(':competitionId/season/:seasonId/team/:teamId')
  @ApiOperation({
    summary: 'Assign a team to a competition',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Team assigned!',
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
    description: 'Competition not found',
  })
  assignTeamToCompetition(
    @Param('competitionId', ParseIntPipe) competitionId: number,
    @Param('seasonId', ParseIntPipe) seasonId: number,
    @Param('teamId', ParseIntPipe) teamId: number,
  ) {
    return this.competitionsService.assignTeam(competitionId, seasonId, teamId);
  }

  @Put(':competitionId/season/:seasonId/teams')
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
    description: 'Competition not found',
  })
  @ApiBody({
    schema: {
      example: [{ teamId: 1 }, { teamId: 2 }, { teamId: 3 }],
    },
  })
  replaceCompetitionTeams(
    @Param('competitionId', ParseIntPipe) competitionId: number,
    @Param('seasonId', ParseIntPipe) seasonId: number,
    @Body() teamIds: number[],
  ) {
    return this.competitionsService.replaceCompetitionTeams(
      competitionId,
      seasonId,
      teamIds,
    );
  }

  @Delete(':competitionId/season/:seasonId/team/:teamId')
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
    description: 'Competition not found',
  })
  deleteTeam(
    @Param('competitionId', ParseIntPipe) competitionId: number,
    @Param('seasonId', ParseIntPipe) seasonId: number,
    @Param('teamId', ParseIntPipe) teamId: number,
  ) {
    return this.competitionsService.deleteTeam(competitionId, seasonId, teamId);
  }
}
