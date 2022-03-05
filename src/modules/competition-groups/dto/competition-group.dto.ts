import { PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { CompetitionDto } from '../../competitions/dto/competition.dto';
import { RegionWithoutCountryDto } from '../../regions/dto/region-without-country.dto';

export class CompetitionGroupDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Transform(({ value }) =>
    plainToInstance(CompetitionDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  competition: CompetitionDto;

  @Transform(({ value }) =>
    value.map((item) =>
      plainToInstance(RegionWithoutCountryDto, item.region, {
        excludeExtraneousValues: true,
      }),
    ),
  )
  @Expose()
  regions: RegionWithoutCountryDto[];
}

export class CompetitionGroupBasicDataDto extends PickType(
  CompetitionGroupDto,
  ['id', 'name'],
) {}
