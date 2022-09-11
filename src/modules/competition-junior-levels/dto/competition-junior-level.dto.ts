import { Expose } from 'class-transformer';

export class CompetitionJuniorLevelDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  level: number;
}
