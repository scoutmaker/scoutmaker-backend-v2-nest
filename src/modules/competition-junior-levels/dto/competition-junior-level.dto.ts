import { Expose } from 'class-transformer';

export class CompetitionJuniorLevelDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  level: number;
}
