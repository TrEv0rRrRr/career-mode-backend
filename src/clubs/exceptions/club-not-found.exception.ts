import { HttpException, HttpStatus } from '@nestjs/common';

export class ClubNotFoundException extends HttpException {
  constructor(message?: string) {
    super(message || 'Club not found', HttpStatus.NOT_FOUND);
  }
}
