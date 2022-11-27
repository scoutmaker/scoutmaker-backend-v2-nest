import {
  IsBoolean,
  IsOptional,
  IsPostalCode,
  IsString,
  IsUrl,
} from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreateClubDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsRequiredStringWithMaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  regionId?: string;

  @IsString()
  countryId: string;

  @IsOptional()
  @IsString()
  lnpId?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsPostalCode('any')
  postalCode?: string;

  @IsOptional()
  @IsString()
  street?: string;

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

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
