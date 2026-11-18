import {
  Body,
  Controller,
  Delete,
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
import { Confederation } from '@prisma/client';
import { UpdateTeamDto } from '../teams/dto/update-team.dto.ts';
import { CreateNationalTeamDto } from './dto/create-national-team.dto.ts';
import { NationalTeamQueryDto } from './dto/national-team-query.dto.ts';
import { NationalTeamsService } from './national-teams.service.ts';

@Controller('national-teams')
export class NationalTeamsController {
  constructor(private readonly nationalTeamsService: NationalTeamsService) {}

  @Get()
  @ApiOperation({
    summary: 'Gets all the NTs o filters them by confederation',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'NTs retrieved!',
  })
  @ApiQuery({
    name: 'confederation',
    required: false,
    enum: Confederation,
    description: 'Filter NTs by confederation',
  })
  getAllNationalTeams(@Query() query: NationalTeamQueryDto) {
    if (query.confederation) {
      return this.nationalTeamsService.findNationalTeamsByConfederation(
        query.confederation,
      );
    }
    return this.nationalTeamsService.findAllNationalTeams();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Gets a team by its id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'NT retrieved!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'NT not found',
  })
  getNationalTeamById(@Param('id', ParseIntPipe) id: number) {
    return this.nationalTeamsService.findNationalTeamById(id);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get a nt by its name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'NT retrieved!',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'NT not found',
  })
  getTeamByName(@Param('name') name: string) {
    return this.nationalTeamsService.findNationalTeamByName(name);
  }

  @Post()
  @ApiOperation({ summary: 'Create a NT' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'NT created!',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'There is a nt with that name already',
  })
  createNationalTeam(@Body() data: CreateNationalTeamDto) {
    return this.nationalTeamsService.createNationalTeam(data);
  }

  @Post('/many')
  @ApiOperation({ summary: 'Create as many nts as you want' })
  @ApiBody({ type: [CreateNationalTeamDto] })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'NTs created!',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "There's a nt with that name already",
  })
  createManyTeams(
    @Body(new ParseArrayPipe({ items: CreateNationalTeamDto }))
    data: CreateNationalTeamDto[],
  ) {
    return this.nationalTeamsService.createManyNationalTeams(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a nt' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'NT updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'NT not found',
  })
  updateTeam(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTeamDto,
  ) {
    return this.nationalTeamsService.updateNationalTeam(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a NT' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'NT deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'NT not found',
  })
  deleteTeam(@Param('id', ParseIntPipe) id: number) {
    return this.nationalTeamsService.deleteNationalTeam(id);
  }
}
