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
import { CareersService } from './careers.service.ts';
import { CreateCareerDto } from './dto/create-career.dto.ts';
import { CareerEntity } from './entities/career.entity.ts';

@Controller('career')
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  @Get()
  @ApiOkResponse({
    type: CareerEntity,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Get all careers',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the careers',
  })
  getAllCareers() {
    return this.careersService.findCareers();
  }

  @Get(':id')
  @ApiOkResponse({
    type: CareerEntity,
  })
  @ApiOperation({ summary: 'Get a career by its id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the career',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Career not found',
  })
  getCareerById(@Param('id', ParseIntPipe) id: number) {
    return this.careersService.findCareerById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a career' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Career created!',
  })
  createCareer(@Body() createCareerDto: CreateCareerDto) {
    return this.careersService.createCareer(createCareerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a career' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Career deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Career not found',
  })
  deleteCareer(@Param('id', ParseIntPipe) id: number) {
    return this.careersService.deleteCareer(id);
  }
}
