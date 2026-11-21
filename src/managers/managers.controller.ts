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
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateManagerDto } from './dto/create-manager.dto.ts';
import { UpdateManagerDto } from './dto/update-manager.dto.ts';
import { ManagersService } from './managers.service.ts';

@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all managers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the managers',
  })
  getAllManagers() {
    return this.managersService.findManagers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a manager by its id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the manager',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Manager not found',
  })
  getManagerById(@Param('id', ParseIntPipe) id: number) {
    return this.managersService.findManagerById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a manager' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Manager created!',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'There is a manager with that name already',
  })
  createManager(@Body() data: CreateManagerDto) {
    return this.managersService.createManager(data);
  }

  @Post('/many')
  @ApiOperation({ summary: 'Create as many managers as you want' })
  @ApiBody({ type: [CreateManagerDto] })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Manager created!',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "There's a manager with that name already",
  })
  createManyManagers(
    @Body(new ParseArrayPipe({ items: CreateManagerDto }))
    data: CreateManagerDto[],
  ) {
    return this.managersService.createManyManagers(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a manager' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Manager updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Manager not found',
  })
  updateManager(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateManagerDto,
  ) {
    return this.managersService.updateManager(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a manager' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Manager deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Manager not found',
  })
  deleteManager(@Param('id', ParseIntPipe) id: number) {
    return this.managersService.deleteManager(id);
  }

  // ! Manager Team Endpoints
  @Get(':managerId/teams/current')
  @ApiOperation({ summary: "Get a manager's current team" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Manager not found',
  })
  getManagerCurrentTeam(@Param('managerId', ParseIntPipe) managerId: number) {
    return this.managersService.findManagerCurrentTeam(managerId);
  }

  @Get(':managerId/teams/history')
  @ApiOperation({ summary: "Get a manager's team history" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Manager not found',
  })
  getManagerTeamHistory(@Param('managerId', ParseIntPipe) managerId: number) {
    return this.managersService.findManagerTeamHistory(managerId);
  }

  // ! Manager National Team Endpoints
  @Get(':managerId/national-teams/current')
  @ApiOperation({ summary: "Get a manager's current national team" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Manager not found',
  })
  getManagerCurrentNationalTeam(
    @Param('managerId', ParseIntPipe) managerId: number,
  ) {
    return this.managersService.findManagerCurrentNationalTeam(managerId);
  }

  @Get(':managerId/national-teams/history')
  @ApiOperation({ summary: "Get a manager's national team history" })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Manager not found',
  })
  getManagerNationalTeamHistory(
    @Param('managerId', ParseIntPipe) managerId: number,
  ) {
    return this.managersService.findManagerNationalTeamHistory(managerId);
  }
}
