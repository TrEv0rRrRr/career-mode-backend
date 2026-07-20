import { HttpException, HttpStatus } from '@nestjs/common';

export class TeamNotFoundException extends HttpException {
  constructor() {
    super('Team not found', HttpStatus.NOT_FOUND);
  }
}
