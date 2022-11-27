import { PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { CompetitionAgeCategoryDto } from '../../competition-age-categories/dto/competition-age-category.dto';
import { CompetitionJuniorLevelDto } from '../../competition-junior-levels/dto/competition-junior-level.dto';
import { CompetitionTypeDto } from '../../competition-types/dto/competition-type.dto';
import { CountryDto } from '../../countries/dto/country.dto';
import { GenderEnum } from '../types';

export class CompetitionDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  level: number;

  @Expose()
  gender: GenderEnum;

  @Expose()
  transfermarktUrl?: string;

  @Transform(({ value }) =>
    plainToInstance(CountryDto, value, { excludeExtraneousValues: true }),
  )
  @Expose()
  country: CountryDto;

  @Transform(({ value }) =>
    plainToInstance(CompetitionAgeCategoryDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  ageCategory: CompetitionAgeCategoryDto;

  @Transform(({ value }) =>
    plainToInstance(CompetitionAgeCategoryDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  type: CompetitionTypeDto;

  @Transform(({ value }) =>
    plainToInstance(CompetitionJuniorLevelDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  juniorLevel?: CompetitionJuniorLevelDto;
}

export class CompetitionBasicDataDto extends PickType(CompetitionDto, [
  'id',
  'name',
  'level',
  'country',
]) {}
