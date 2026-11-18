import { HttpException, HttpStatus } from '@nestjs/common';

export class NationalTeamNotFoundException extends HttpException {
  constructor(message?: string) {
    super(message || 'National Team not found', HttpStatus.NOT_FOUND);
  }
}
