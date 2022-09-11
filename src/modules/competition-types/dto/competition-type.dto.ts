import { Expose } from 'class-transformer';

export class CompetitionTypeDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
