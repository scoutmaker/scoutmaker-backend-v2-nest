import { Expose } from 'class-transformer';

export class RegionWithoutCountryDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
