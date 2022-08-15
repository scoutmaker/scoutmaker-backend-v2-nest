import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { mapStringToNumber } from '../../../utils/helpers';
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
  @Transform(({ value }) => mapStringToNumber(value))
  @IsArray()
  @IsInt({ each: true })
  regionIds?: number[];

  @IsOptional()
  @Transform(({ value }) => mapStringToNumber(value))
  @IsArray()
  @IsInt({ each: true })
  clubIds?: number[];

  @IsOptional()
  @Transform(({ value }) => mapStringToNumber(value))
  @IsArray()
  @IsInt({ each: true })
  footballRoleIds?: number[];
}
