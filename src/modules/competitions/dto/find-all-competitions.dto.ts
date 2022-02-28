import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';
import { GenderEnum } from '../types';

export class FindAllCompetitionsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(15)
  level?: number;

  @IsOptional()
  @IsEnum(GenderEnum, {
    message: `Gender must be a valid enum value. Available values: ${Object.keys(
      GenderEnum,
    ).join(', ')}`,
  })
  gender?: GenderEnum;

  @IsOptional()
  @IsCuid()
  countryId?: string;

  @IsOptional()
  @IsCuid()
  ageCategoryId?: string;

  @IsOptional()
  @IsCuid()
  typeId?: string;

  @IsOptional()
  @IsCuid()
  juniorLevelId?: string;
}
