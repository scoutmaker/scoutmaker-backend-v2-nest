import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsPostalCode,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreateAgencyDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsInt()
  countryId: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  @Transform(({ value }) => value.trim())
  city?: string;

  @IsOptional()
  @IsPostalCode('any')
  postalCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  @Transform(({ value }) => value.trim())
  street?: string;

  @IsOptional()
  @IsUrl()
  transfermarktUrl?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsUrl()
  twitter?: string;

  @IsOptional()
  @IsUrl()
  facebook?: string;

  @IsOptional()
  @IsUrl()
  instagram?: string;
}
