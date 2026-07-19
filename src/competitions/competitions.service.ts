import { Injectable } from '@nestjs/common';
import { CompetitionType } from '@prisma/client';
import { CompetitionsRepository } from './competitions.repository.ts';
import { CompetitionNotFoundException } from './exceptions/competition-not-found.exception.ts';

@Injectable()
export class CompetitionsService {
  constructor(private repo: CompetitionsRepository) {}

  async findCompetitionById(id: number) {
    const competition = await this.repo.findById(id);

    if (!competition) throw new CompetitionNotFoundException();

    return competition;
  }

  findCompetitions() {
    return this.repo.findAll();
  }

  findCompetitionsByType(type: CompetitionType) {
    return this.repo.findByType(type);
  }
}
