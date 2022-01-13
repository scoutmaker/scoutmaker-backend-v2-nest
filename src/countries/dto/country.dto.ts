import { Expose } from 'class-transformer';

export class CountryDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  isEuMember: boolean;
}
