import { Expose } from 'class-transformer';

export class CountryDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  isEuMember: boolean;
}
