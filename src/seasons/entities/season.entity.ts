export class SeasonEntity {
  id!: number;
  code!: string;
  notes?: string;
  startDate!: Date;
  endDate!: Date;
  careerId!: number;
}
