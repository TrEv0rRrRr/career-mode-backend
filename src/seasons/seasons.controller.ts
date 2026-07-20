import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateSeasonDto } from './dto/create-season.dto.ts';
import { SeasonEntity } from './entities/season.entity.ts';
import { SeasonsService } from './seasons.service.ts';

@Controller('seasons')
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}

  @Get()
  @ApiOkResponse({
    type: SeasonEntity,
    isArray: true,
  })
  @ApiOperation({ summary: 'Get all seasons' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the seasons',
  })
  findAll() {
    return this.seasonsService.findSeasons();
  }

  @Get(':id')
  @ApiOkResponse({
    type: SeasonEntity,
  })
  @ApiOperation({ summary: 'Get a season by its id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the season',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Season not found',
  })
  getSeasonById(@Param('id', ParseIntPipe) id: number) {
    return this.seasonsService.findSeasonById(id);
  }

  @Get('year/:year')
  @ApiOkResponse({
    type: SeasonEntity,
  })
  @ApiOperation({ summary: 'Get a season by its year' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the season',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Season not found',
  })
  getSeasonByYear(@Param('year') year: string) {
    return this.seasonsService.findSeasonByYear(year);
  }

  @Post()
  @ApiOperation({ summary: 'Create a season' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Season created!',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'There is a season with that name already',
  })
  createSeason(@Body() data: CreateSeasonDto) {
    return this.seasonsService.createSeason(data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a season' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Season deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Season not found',
  })
  deleteSeason(@Param('id') id: string) {
    return this.seasonsService.deleteSeason(+id);
  }
}
