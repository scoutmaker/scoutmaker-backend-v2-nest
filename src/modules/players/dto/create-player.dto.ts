import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';
import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';
import { FootEnum } from '../types';

export class CreatePlayerDto {
  @IsRequiredStringWithMaxLength(30)
  firstName: string;

  @IsRequiredStringWithMaxLength(30)
  lastName: string;

  @IsCuid()
  countryId: string;

  @IsCuid()
  primaryPositionId: string;

  @IsOptional()
  @IsArray()
  @IsCuid({ each: true })
  secondaryPositionIds?: string[];

  @IsCuid()
  teamId: string;

  @IsInt()
  @Min(1950)
  @Max(2050)
  yearOfBirth: number;

  @IsOptional()
  @IsInt()
  @Min(140)
  @Max(220)
  height?: number;

  @IsOptional()
  @IsInt()
  @Min(40)
  @Max(150)
  weight?: number;

  @IsEnum(FootEnum, {
    message: `Footed must be a valid enum value. Available values: ${Object.keys(
      FootEnum,
    ).join(', ')}`,
  })
  footed: FootEnum;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  lnpId?: string;

  @IsOptional()
  @IsUrl()
  lnpUrl?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  minut90id?: string;

  @IsOptional()
  @IsUrl()
  minut90url?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  transfermarktId?: string;

  @IsOptional()
  @IsUrl()
  transfermarktUrl?: string;
}
