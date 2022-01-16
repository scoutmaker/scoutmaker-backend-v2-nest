import { Expose, plainToClass, Transform } from 'class-transformer';
import { CountryDto } from '../../countries/dto/country.dto';
import { RegionWithoutCountryDto } from '../../regions/dto/region-without-country.dto';

export class CompetitionDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  group?: string;

  @Transform(({ value }) =>
    plainToClass(CountryDto, value, { excludeExtraneousValues: true }),
  )
  @Expose()
  country: CountryDto;

  @Transform(({ value }) => {
    const regions = value.map((item) => item.region);
    return plainToClass(RegionWithoutCountryDto, regions, {
      excludeExtraneousValues: true,
    });
  })
  @Expose()
  regions: RegionWithoutCountryDto[];

  @Expose()
  isJunior: boolean;

  @Expose()
  isWomen: boolean;

  @Expose()
  juniorLevel?: string;
}
