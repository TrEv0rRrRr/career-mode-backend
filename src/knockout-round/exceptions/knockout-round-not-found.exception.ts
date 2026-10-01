import { HttpException, HttpStatus } from '@nestjs/common';

export class KnockoutRoundNotFoundException extends HttpException {
  constructor() {
    super('Knockout Round not found', HttpStatus.NOT_FOUND);
  }
}
