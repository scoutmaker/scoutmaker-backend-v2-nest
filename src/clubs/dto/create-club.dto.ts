import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsPostalCode,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateClubDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @IsString()
  regionId: string;

  @IsOptional()
  @IsString()
  lnpID?: string;

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
  isPublic?: boolean = false;
}
