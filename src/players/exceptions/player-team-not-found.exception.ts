import { HttpException, HttpStatus } from '@nestjs/common';

export class PlayerTeamNotFoundException extends HttpException {
  constructor() {
    super(
      'This player has never played for that team before or is not playing for that team currently.',
      HttpStatus.NOT_FOUND,
    );
  }
}
