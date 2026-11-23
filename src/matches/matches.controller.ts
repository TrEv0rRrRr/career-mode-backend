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
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { MatchFinishType, MatchType } from '@prisma/client';
import { ChangeMatchStadiumDTO } from './dto/change-match-stadium.dto.ts';
import { CreateMatchDto } from './dto/create-match.dto.ts';
import { PlayMatchQueryDto } from './dto/play-match-query.dto.ts';
import { PlayMatchDto } from './dto/play-match.dto.ts';
import {
  MatchesWithTieResponseDto,
  MatchResponseDto,
} from './dto/response/match-response.dto.ts';
import { MatchesService } from './matches.service.ts';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get(':matchId')
  @ApiOperation({
    summary: 'Gets a match',
  })
  @ApiOkResponse({
    type: MatchResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Match retrieved',
    type: MatchResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Match not found',
  })
  async getMatch(@Param('matchId', ParseIntPipe) matchId: number) {
    return this.matchesService.findMatch(matchId);
  }

  @Get('/ties/:tieId')
  @ApiOperation({
    summary: 'Find matches by tie id',
  })
  @ApiOkResponse({
    type: MatchesWithTieResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Matches retrieved',
    type: MatchesWithTieResponseDto,
  })
  async getMatchesByTie(@Param('tieId', ParseIntPipe) tieId: number) {
    return this.matchesService.findMatchesByTieId(tieId);
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
    description: 'Club not found',
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
    description: "The home club doesn't participate in the given competition",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "The away club doesn't participate in the given competition",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The clubs must be different',
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
      'If the match reached the penalties, you should enter the penalty score for both home and away club',
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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'A two-legged knockout match must have a leg and a tie',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The tieId does not belong to this match',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'The first leg of a two-legged knockout must end in regular time',
  })
  @ApiQuery({
    name: 'finishType',
    required: true,
    enum: MatchFinishType,
    description: 'Select the way the match ended',
  })
  @ApiQuery({
    name: 'tieId',
    required: false,
    type: Number,
    description: 'The tie id associated with this matches',
  })
  playMatch(
    @Param('matchId', ParseIntPipe) matchId: number,
    @Body() data: PlayMatchDto,
    @Query() query: PlayMatchQueryDto,
  ) {
    if (query.tieId) {
      return this.matchesService.playMatch(
        matchId,
        data,
        query.finishType,
        query.tieId,
      );
    }
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
