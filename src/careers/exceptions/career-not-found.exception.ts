import { HttpException, HttpStatus } from '@nestjs/common';

export class CareerNotFoundException extends HttpException {
  constructor() {
    super('Career not found', HttpStatus.NOT_FOUND);
  }
}
