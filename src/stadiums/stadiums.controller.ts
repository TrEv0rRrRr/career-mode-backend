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
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StadiumEntity } from '../stadiums/entities/stadium.entity.ts';
import { CreateStadiumDto } from './dto/create-stadium.dto.ts';
import { UpdateStadiumDto } from './dto/update-stadium.dto.ts';
import { StadiumsService } from './stadiums.service.ts';

@Controller('stadiums')
export class StadiumsController {
  constructor(private readonly stadiumsService: StadiumsService) {}

  @Get()
  @ApiOkResponse({
    type: StadiumEntity,
    isArray: true,
  })
  @ApiOperation({ summary: 'Get all stadiums' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the stadiums',
  })
  getAllStadiums() {
    return this.stadiumsService.findStadiums();
  }

  @Get(':id')
  @ApiOkResponse({
    type: StadiumEntity,
  })
  @ApiOperation({ summary: 'Get a stadium by its id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the stadium',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Stadium not found',
  })
  getStadiumById(@Param('id', ParseIntPipe) id: number) {
    return this.stadiumsService.findStadiumById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a stadium' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Stadium created!',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'There is a stadium with that name already',
  })
  createStadium(@Body() data: CreateStadiumDto) {
    return this.stadiumsService.createStadium(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a stadium' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Stadium updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Stadium not found',
  })
  updateStadium(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateStadiumDto,
  ) {
    return this.stadiumsService.updateStadium(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a stadium' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Stadium deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Stadium not found',
  })
  deleteStadium(@Param('id', ParseIntPipe) id: number) {
    return this.stadiumsService.deleteStadium(id);
  }
}
