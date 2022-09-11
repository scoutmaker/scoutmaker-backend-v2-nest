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
  @Type(() => Number)
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
  countryId?: string;

  @IsOptional()
  @IsInt()
  ageCategoryId?: string;

  @IsOptional()
  @IsInt()
  typeId?: string;

  @IsOptional()
  @IsInt()
  juniorLevelId?: string;
}
