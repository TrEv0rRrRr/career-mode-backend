import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { TransferType } from '@prisma/client';
import { CreateTransferDto } from './dto/create-transfer.dto.ts';
import {
  TransferTypeOptionalQueryDto,
  TransferTypeRequiredQueryDto,
} from './dto/transfer-query.dto.ts';
import { TransfersService } from './transfers.service.ts';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get()
  @ApiOperation({
    summary: 'Gets all transfers or filters them by type',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gets the transfers',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: TransferType,
    description: 'Filter transfers by type',
  })
  getTransfers(@Query() query: TransferTypeOptionalQueryDto) {
    if (query.type)
      return this.transfersService.findTransfersByType(query.type);

    return this.transfersService.findTransfers();
  }

  @Post()
  @ApiOperation({ summary: 'Completes a new transfer' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Transfer completed',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Team not found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Season not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The transfer fee cannot be negative',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The selling team cannot be the same as the buying team',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'The player is not currently playing for the specified selling team.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The player is not currently registered with any team.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The player already belongs to a team.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The transfer date must be within the selected season.',
  })
  @ApiQuery({
    name: 'type',
    required: true,
    enum: TransferType,
    description: 'Select the transfer type',
  })
  completeTransfer(
    @Body() data: CreateTransferDto,
    @Query() query: TransferTypeRequiredQueryDto,
  ) {
    return this.transfersService.completeTransfer(data, query.type);
  }

  @Delete(':transferId')
  @ApiOperation({ summary: 'Deletes a transfer. Development purposes only!' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Transfer deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transfer not found',
  })
  deleteTransfer(@Param('transferId', ParseIntPipe) transferId: number) {
    return this.transfersService.deleteTransfer(transferId);
  }
}
