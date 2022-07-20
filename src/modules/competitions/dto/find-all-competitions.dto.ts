import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

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
  @IsInt()
  @Type(() => Number)
  countryId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  ageCategoryId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  typeId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  juniorLevelId?: number;
}
