import { PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { CountryDto } from '../../countries/dto/country.dto';

export class AgencyDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  city?: string;

  @Expose()
  postalCode?: string;

  @Expose()
  street?: string;

  @Expose()
  transfermarktUrl?: string;

  @Expose()
  email?: string;

  @Expose()
  website?: string;

  @Expose()
  twitter?: string;

  @Expose()
  facebook?: string;

  @Expose()
  instagram?: string;

  @Transform(({ value }) =>
    plainToInstance(CountryDto, value, { excludeExtraneousValues: true }),
  )
  @Expose()
  country: CountryDto;
}

export class AgencyBasicInfoDto extends PickType(AgencyDto, ['id', 'name']) {}
