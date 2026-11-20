import { Confederation, Player, PreferredFoot } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/wasm-compiler-edge';

export type PlayerNationalTeam = {
  player: {
    id: number;
    name: string;
    birthDate: Date;
    nationality: string;
    face: string | null;
    preferredFoot: PreferredFoot;
    overall: number;
    height: Decimal;
    weight: number;
  };
} & {
  id: number;
  playerId: number;
  nationalTeamId: number;
  jerseyNumber: number;
  startDate: Date;
  endDate: Date | null;
};

export class NationalTeamResponseDto {
  id!: number;
  name!: string;
  logo!: string | null;
  confederation!: Confederation;
  manager!: string | null;
  stadium!: string;
}

export class CurrentCallUpPlayersResponseDto {
  jerseyNumber!: number;
  startDate!: Date;
  player!: Player;
}
