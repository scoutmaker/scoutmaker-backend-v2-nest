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
  countryId?: number;

  @IsOptional()
  @IsInt()
  ageCategoryId?: number;

  @IsOptional()
  @IsInt()
  typeId?: number;

  @IsOptional()
  @IsInt()
  juniorLevelId?: number;
}
