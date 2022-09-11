import { Expose, plainToClass, Transform } from 'class-transformer';

import { CountryDto } from '../../countries/dto/country.dto';

export class RegionDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Transform(({ value }) =>
    plainToClass(CountryDto, value, { excludeExtraneousValues: true }),
  )
  @Expose()
  country: CountryDto;
}
