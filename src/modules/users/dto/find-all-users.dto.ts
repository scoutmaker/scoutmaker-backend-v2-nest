import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import { IsOptionalStringArray } from '../../../common/decorators/string-array-filter.decorator';
import { UserRoleEnum } from '../types';

export class FindAllUsersDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray()
  @IsEnum(UserRoleEnum, {
    message: `Role must be a valid enum value. Available values: ${Object.keys(
      UserRoleEnum,
    ).join(', ')}`,
    each: true,
  })
  roles?: UserRoleEnum[];

  @IsOptionalStringArray()
  regionIds?: string[];

  @IsOptionalStringArray()
  clubIds?: string[];

  @IsOptionalStringArray()
  footballRoleIds?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  hasScoutProfile?: boolean;
}
