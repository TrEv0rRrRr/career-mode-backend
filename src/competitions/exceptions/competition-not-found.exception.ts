import { HttpException, HttpStatus } from '@nestjs/common';

export class CompetitionNotFoundException extends HttpException {
  constructor() {
    super('Competition not found', HttpStatus.NOT_FOUND);
  }
}
