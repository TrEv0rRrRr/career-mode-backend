import { HttpException, HttpStatus } from '@nestjs/common';

export class ParticipantNotFoundException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'That team is not participating in the given competition',
      HttpStatus.NOT_FOUND,
    );
  }
}
