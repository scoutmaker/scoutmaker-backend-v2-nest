import {
  IsBoolean,
  IsOptional,
  IsPostalCode,
  IsString,
  IsUrl,
} from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';
import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';

export class CreateClubDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;

  @IsCuid()
  regionId: string;

  @IsCuid()
  countryId: string;

  @IsOptional()
  @IsCuid()
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
