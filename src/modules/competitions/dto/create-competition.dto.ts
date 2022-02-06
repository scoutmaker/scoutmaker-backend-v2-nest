import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { GenderEnum } from '../types';
import { IsCuid } from '../../../decorators/is-cuid.decorator';
import { IsRequiredStringWithMaxLength } from '../../../decorators/is-required-string-with-max-length.decorator';

export class CreateCompetitionDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;

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
  countryId: string;

  @IsNotEmpty()
  @IsCuid()
  ageCategoryId: string;

  @IsNotEmpty()
  @IsCuid()
  typeId: string;

  @IsOptional()
  @IsCuid()
  juniorLevelId?: string;
}
