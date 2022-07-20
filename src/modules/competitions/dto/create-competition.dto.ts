import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';
import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';
import { GenderEnum } from '../types';

export class CreateCompetitionDto {
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
  @IsCuid()
  countryId: number;

  @IsNotEmpty()
  @IsCuid()
  ageCategoryId: number;

  @IsNotEmpty()
  @IsCuid()
  typeId: number;

  @IsOptional()
  @IsCuid()
  juniorLevelId?: string;
}
