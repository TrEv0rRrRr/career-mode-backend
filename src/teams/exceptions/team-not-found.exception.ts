import { HttpException, HttpStatus } from '@nestjs/common';

export class TeamNotFoundException extends HttpException {
  constructor(message?: string) {
    super(message || 'Team not found', HttpStatus.NOT_FOUND);
  }
}
