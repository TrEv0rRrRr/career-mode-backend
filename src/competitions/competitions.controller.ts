import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
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
    summary: 'Assign a winner team to a competition edition',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Winner team assigned!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Competition not found',
  })
  assignWinnerTeamToCompetition(
    @Param('editionId', ParseIntPipe) editionId: number,
    @Body() data: UpdateCompetitionEditionDto,
  ) {
    return this.competitionsService.assignWinnerTeam(editionId, data);
  }
}
