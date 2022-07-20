import { Expose } from 'class-transformer';

export class CompetitionTypeDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
