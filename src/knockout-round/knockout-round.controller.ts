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
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { MatchType } from '@prisma/client';
import { CreateKnockoutRoundDto } from './dto/create-knockout-round.dto.ts';
import { KnockoutRoundQueryDto } from './dto/knockout-round-query.dto.ts';
import { KnockoutRoundService } from './knockout-round.service.ts';

@Controller('knockout-round')
export class KnockoutRoundController {
  constructor(private readonly knockoutRoundService: KnockoutRoundService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Gets a knockout round by its id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the knockout round',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Knockout round not found',
  })
  getKnockoutRoundById(@Param('id', ParseIntPipe) id: number) {
    return this.knockoutRoundService.findKnockoutRoundById(id);
  }

  @Get(':competitionEditionId')
  @ApiOperation({
    summary: 'Gets a knockout round by its round and competition edition id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the knockout round',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Knockout round not found',
  })
  @ApiQuery({
    name: 'type',
    required: true,
    enum: MatchType,
    description: 'Filter knockouts by round',
  })
  getKnockoutRoundByTypeAndCompetitionId(
    @Param('competitionEditionId', ParseIntPipe) competitionEditionId: number,
    @Query() query: KnockoutRoundQueryDto,
  ) {
    return this.knockoutRoundService.findKnockoutRoundByTypeAndCompetitionId(
      competitionEditionId,
      query.type,
    );
  }

  @Post('/create')
  @ApiOperation({
    summary: 'Creates a knockout round',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Knockout round created!',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      "They can't be more or less than 32 qualified teams for a round of 32.",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      "They can't be more or less than 16 qualified teams for a round of 16.",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      "They can't be more or less than 8 qualified teams for the quarterfinals.",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      "They can't be more or less than 4 qualified teams for the semifinals.",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      "They can't be more or less than 2 qualified teams for the third place match or the final.",
  })
  createKnockoutRound(@Body() data: CreateKnockoutRoundDto) {
    return this.knockoutRoundService.createKnockoutRound(data);
  }

  @Patch('/complete/:id')
  @ApiOperation({
    summary: 'Sets a knockout round as completed',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Knockout round completed!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Knockout round not found',
  })
  completeKnockoutRound(@Param('id', ParseIntPipe) id: number) {
    return this.knockoutRoundService.completeKnockoutRound(id);
  }
}
