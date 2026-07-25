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

  @Post('/competition/:competitionId/create-match')
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
  createMatch(
    @Param('competitionId', ParseIntPipe) competitionId: number,
    @Body() data: CreateMatchDto,
  ) {
    return this.matchesService.createMatch(competitionId, data);
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
  playMatch(
    @Param('matchId', ParseIntPipe) matchId: number,
    @Body() data: UpdateMatchDto,
  ) {
    return this.matchesService.updateMatch(matchId, data);
  }
}
