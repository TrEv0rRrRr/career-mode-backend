import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PositionsService } from './positions.service.ts';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  @ApiOperation({ summary: 'Gets all positions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the positions',
  })
  getAllPositions() {
    return this.positionsService.findPositions();
  }
}
