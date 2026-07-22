import { HttpException, HttpStatus } from '@nestjs/common';

export class TransferNotFoundException extends HttpException {
  constructor() {
    super('Transfer not found', HttpStatus.NOT_FOUND);
  }
}
