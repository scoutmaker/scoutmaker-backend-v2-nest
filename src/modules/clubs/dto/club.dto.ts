import { PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { CountryDto } from '../../countries/dto/country.dto';
import { RegionWithoutCountryDto } from '../../regions/dto/region-without-country.dto';

export class ClubDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  lnpId?: string;

  @Expose()
  city?: string;

  @Expose()
  postalCode?: string;

  @Expose()
  street?: string;

  @Expose()
  website?: string;

  @Expose()
  twitter?: string;

  @Expose()
  facebook?: string;

  @Expose()
  instagram?: string;

  @Transform(({ value }) =>
    plainToInstance(CountryDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  country: CountryDto;

  @Transform(({ value }) =>
    plainToInstance(RegionWithoutCountryDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  region: RegionWithoutCountryDto;
}

export class ClubBasicDataDto extends PickType(ClubDto, ['id', 'name']) {}
