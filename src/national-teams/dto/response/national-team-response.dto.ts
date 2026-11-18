import { Confederation } from '@prisma/client';

export class NationalTeamResponseDto {
  id!: number;
  name!: string;
  logo!: string | null;
  confederation!: Confederation;
  manager!: string | null;
  stadium!: string;
}
