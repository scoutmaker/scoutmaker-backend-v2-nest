import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';

import { IsRequiredStringWithMaxLength } from '../../../common/decorators/is-required-string-with-max-length.decorator';
import { MatchesProperty } from '../../../common/decorators/matches-property.decorator';
import { PASSWORD_REGEXP } from '../../../utils/constants';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsRequiredStringWithMaxLength(50)
  firstName: string;

  @IsRequiredStringWithMaxLength(50)
  lastName: string;

  @IsOptional()
  @IsString()
  clubId?: string;

  @IsOptional()
  @IsString()
  footballRoleId?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsString()
  @MinLength(6)
  @Matches(PASSWORD_REGEXP, {
    message:
      'Password must contain at least 1 lowercase letter, 1 uppercase letter and 1 digit',
  })
  password: string;

  @IsString()
  @MinLength(6)
  @MatchesProperty(RegisterUserDto, (s) => s.password, {
    message: 'Passwords do not match',
  })
  passwordConfirm: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  activeRadius?: number;

  @IsOptional()
  @IsString()
  regionId?: string;
}
