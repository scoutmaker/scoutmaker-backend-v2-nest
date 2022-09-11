import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';
import { GenderEnum } from '../types';

export class CreateCompetitionDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(15)
  level: number;

  @IsOptional()
  @IsEnum(GenderEnum, {
    message: `Gender must be a valid enum value. Available values: ${Object.keys(
      GenderEnum,
    ).join(', ')}`,
  })
  gender?: GenderEnum;

  @IsNotEmpty()
  @IsString()
  countryId: string;

  @IsNotEmpty()
  @IsString()
  ageCategoryId: string;

  @IsNotEmpty()
  @IsString()
  typeId: string;

  @IsOptional()
  @IsString()
  juniorLevelId?: string;
}
