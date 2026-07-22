import { HttpException, HttpStatus } from '@nestjs/common';

export class CompetitionEditionNotFoundException extends HttpException {
  constructor() {
    super('Edition not found', HttpStatus.NOT_FOUND);
  }
}
