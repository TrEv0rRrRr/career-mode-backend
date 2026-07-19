import { HttpException, HttpStatus } from '@nestjs/common';

export class StadiumNotFoundException extends HttpException {
  constructor() {
    super('Stadium not found', HttpStatus.NOT_FOUND);
  }
}
