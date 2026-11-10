import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { MatchFinishType, MatchType } from '@prisma/client';
import { ChangeMatchStadiumDTO } from './dto/change-match-stadium.dto.ts';
import { CreateMatchDto } from './dto/create-match.dto.ts';
import { PlayMatchQueryDto } from './dto/play-match-query.dto.ts';
import { PlayMatchDto } from './dto/play-match.dto.ts';
import { MatchesService } from './matches.service.ts';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get(':matchId')
  @ApiOperation({
    summary: 'Gets a match',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Match retrieved',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Match not found',
  })
  getMatch(@Param('matchId', ParseIntPipe) matchId: number) {
    return this.matchesService.findMatch(matchId);
  }

  @Patch(':matchId/stadium')
  @ApiOperation({
    summary: 'Changes the stadium of the match',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Stadium changed!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Match not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Stadium not found',
  })
  changeMatchStadium(
    @Param('matchId', ParseIntPipe) matchId: number,
    @Body() data: ChangeMatchStadiumDTO,
  ) {
    return this.matchesService.changeStadium(matchId, data);
  }

  @Post('/competition/editions/:competitionEditionId/many')
  @ApiOperation({
    summary: 'Create as many matches as you want',
  })
  @ApiBody({ type: [CreateMatchDto] })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Match created!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Stadium not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Competition edition not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "The home team doesn't participate in the given competition",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "The away team doesn't participate in the given competition",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The teams must be different',
  })
  @ApiQuery({
    name: 'type',
    required: true,
    enum: MatchType,
  })
  createManyMatches(
    @Param('competitionEditionId', ParseIntPipe) competitionEditionId: number,
    @Query('type') type: MatchType,
    @Body(new ParseArrayPipe({ items: CreateMatchDto }))
    data: CreateMatchDto[],
  ) {
    return this.matchesService.createManyMatches(
      competitionEditionId,
      type,
      data,
    );
  }

  @Patch(':matchId/play')
  @ApiOperation({
    summary: "Updates the match's result",
  })
  @ApiBody({ type: PlayMatchDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Match updated!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Match not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'If the match reached the penalties, you should enter a tied score',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'If the match reached the penalties, you should enter the penalty score for both home and away team',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "The penalties can't end in a tie",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      "If the match didn't reached the penalties, you shouldn't enter them",
  })
  @ApiQuery({
    name: 'finishType',
    required: true,
    enum: MatchFinishType,
    description: 'Select the way the match ended',
  })
  playMatch(
    @Param('matchId', ParseIntPipe) matchId: number,
    @Body() data: PlayMatchDto,
    @Query() query: PlayMatchQueryDto,
  ) {
    return this.matchesService.playMatch(matchId, data, query.finishType);
  }

  @Get('/competition/editions/:competitionEditionId/matches')
  @ApiOperation({
    summary: 'Counts the number of matches of a competition edition',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Matches counted!',
  })
  countCompetitionEditionMatches(
    @Param('competitionEditionId', ParseIntPipe) competitionEditionId: number,
  ) {
    return this.matchesService.countMatchesByCompetitionEdition(
      competitionEditionId,
    );
  }
}
