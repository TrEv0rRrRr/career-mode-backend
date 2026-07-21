import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PositionEntity } from './entities/position.entity.ts';
import { PositionsService } from './positions.service.ts';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  @ApiOkResponse({
    type: PositionEntity,
    isArray: true,
  })
  @ApiOperation({ summary: 'Gets all positions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the positions',
  })
  findAll() {
    return this.positionsService.findPositions();
  }
}
