import { PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { CompetitionBasicDataDto } from '../../competitions/dto/competition.dto';
import { RegionWithoutCountryDto } from '../../regions/dto/region-without-country.dto';

export class CompetitionGroupDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Transform(({ value }) =>
    plainToInstance(CompetitionBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  competition: CompetitionBasicDataDto;

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
  ['id', 'name', 'competition'],
) {}
