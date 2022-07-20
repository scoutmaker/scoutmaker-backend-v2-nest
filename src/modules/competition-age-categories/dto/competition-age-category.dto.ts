import { Expose } from 'class-transformer';

export class CompetitionAgeCategoryDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
