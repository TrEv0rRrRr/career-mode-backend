import { HttpException, HttpStatus } from '@nestjs/common';

export class ManagerNotFoundException extends HttpException {
  constructor() {
    super('Manager not found', HttpStatus.NOT_FOUND);
  }
}
