import { Expose } from 'class-transformer';

export class CompetitionAgeCategoryDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
