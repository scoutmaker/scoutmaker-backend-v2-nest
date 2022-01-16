import { Expose } from 'class-transformer';

export class CompetitionWithoutCountryAndRegionsDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  group?: string;

  @Expose()
  isJunior: boolean;

  @Expose()
  isWomen: boolean;

  @Expose()
  juniorLevel?: string;
}
