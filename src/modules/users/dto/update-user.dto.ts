import {
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Min,
} from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsCuid()
  clubId?: string;

  @IsOptional()
  @IsCuid()
  footballRoleId?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  activeRadius?: number;

  @IsOptional()
  @IsCuid()
  regionId?: string;
}
