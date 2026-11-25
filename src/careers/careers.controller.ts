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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CareersService } from './careers.service.ts';
import { CreateCareerDto } from './dto/create-career.dto.ts';

@Controller('careers')
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  @Get()
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

  @Get('/current')
  @ApiOperation({ summary: 'Get the current career' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the career',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Career not found',
  })
  getCurrentCareer() {
    return this.careersService.findCurrentCareer();
  }

  @Get('/current/club/:clubId')
  @ApiOperation({ summary: 'Get the current career by club id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the career',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Career not found',
  })
  getCurrentCareerByClubId(@Param('clubId', ParseIntPipe) clubId: number) {
    return this.careersService.findCurrentCareerByClubId(clubId);
  }

  @Patch('/current/complete')
  @ApiOperation({ summary: 'Complete the current career' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the career',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Career not found',
  })
  completeCurrentCareer() {
    return this.careersService.completeCurrentCareer();
  }

  @Patch(':careerId/complete')
  @ApiOperation({ summary: 'Complete a career' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the career',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Career not found',
  })
  completeCareer(@Param('careerId', ParseIntPipe) careerId: number) {
    return this.careersService.completeCareer(careerId);
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
