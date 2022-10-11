import { IsEnum, IsOptional, IsString } from 'class-validator';

import { IsOptionalStringArray } from '../../../common/decorators/string-array-filter.decorator';
import { UserRoleEnum } from '../types';

export class FindAllUsersDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(UserRoleEnum, {
    message: `Footed must be a valid enum value. Available values: ${Object.keys(
      UserRoleEnum,
    ).join(', ')}`,
  })
  role?: UserRoleEnum;

  @IsOptionalStringArray()
  regionIds?: string[];

  @IsOptionalStringArray()
  clubIds?: string[];

  @IsOptionalStringArray()
  footballRoleIds?: string[];
}
