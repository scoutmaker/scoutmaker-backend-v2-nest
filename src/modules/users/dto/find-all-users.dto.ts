import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  regionIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  clubIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  footballRoleIds?: string[];
}
