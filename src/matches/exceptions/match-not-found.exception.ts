import { HttpException, HttpStatus } from '@nestjs/common';

export class MatchNotFoundException extends HttpException {
  constructor() {
    super('Match not found', HttpStatus.NOT_FOUND);
  }
}
