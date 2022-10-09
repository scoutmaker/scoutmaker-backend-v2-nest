import { IsEnum, IsOptional, IsString } from 'class-validator';

import { OptionalStringArray } from '../../../common/decorators/string-array-filter.decorator';
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

  @OptionalStringArray()
  regionIds?: string[];

  @OptionalStringArray()
  clubIds?: string[];

  @OptionalStringArray()
  footballRoleIds?: string[];
}
