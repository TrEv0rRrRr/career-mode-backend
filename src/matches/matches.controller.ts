import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChangeMatchStadiumDTO } from './dto/change-match-stadium.dto.ts';
import { CreateMatchDto } from './dto/create-match.dto.ts';
import { UpdateMatchDto } from './dto/update-match.dto.ts';
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

  @Post('/competition/editions/:competitionEditionId/create-match')
  @ApiOperation({
    summary: 'Creates a match',
  })
  @ApiResponse({
    status: HttpStatus.OK,
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
  createMatch(
    @Param('competitionId', ParseIntPipe) competitionEditionId: number,
    @Body() data: CreateMatchDto,
  ) {
    return this.matchesService.createMatch(competitionEditionId, data);
  }

  @Patch(':matchId/play')
  @ApiOperation({
    summary: "Updates the match's result",
  })
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
  playMatch(
    @Param('matchId', ParseIntPipe) matchId: number,
    @Body() data: UpdateMatchDto,
  ) {
    return this.matchesService.updateMatch(matchId, data);
  }
}
