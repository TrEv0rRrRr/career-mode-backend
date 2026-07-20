import { HttpException, HttpStatus } from '@nestjs/common';

export class SeasonNotFoundException extends HttpException {
  constructor() {
    super('Season not found', HttpStatus.NOT_FOUND);
  }
}
