import { Injectable } from '@nestjs/common';
import { PositionsRepository } from './positions.repository.ts';

@Injectable()
export class PositionsService {
  constructor(private repo: PositionsRepository) {}

  findPositions() {
    return this.repo.findAll();
  }
}
