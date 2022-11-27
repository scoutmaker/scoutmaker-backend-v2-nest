import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';
import { AccountStatusEnum, UserRoleEnum } from '../types';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsEnum(UserRoleEnum, {
    message: `Role must be a valid enum value. Available values: ${Object.keys(
      UserRoleEnum,
    ).join(', ')}`,
  })
  role?: UserRoleEnum;

  @IsOptional()
  @IsEnum(AccountStatusEnum, {
    message: `Account status must be a valid enum value. Available values: ${Object.keys(
      UserRoleEnum,
    ).join(', ')}`,
  })
  status?: AccountStatusEnum;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsRequiredStringWithMaxLength(50)
  firstName: string;

  @IsRequiredStringWithMaxLength(50)
  lastName: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  activeRadius?: number;

  @IsOptional()
  @IsString()
  scoutmakerv1Id?: string;

  @IsOptional()
  @IsString()
  regionId?: string;

  @IsOptional()
  @IsString()
  footballRoleId?: string;
}
