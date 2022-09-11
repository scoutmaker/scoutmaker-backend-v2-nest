import { Expose } from 'class-transformer';

export class RegionWithoutCountryDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
