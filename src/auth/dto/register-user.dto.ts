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
import { MatchesProperty } from '../../decorators/matches-property.decorator';
import { PASSWORD_REGEXP } from '../../utils/constants';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

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

  @IsNumber()
  @Min(0)
  activeRadius?: number;

  @IsString()
  @IsNotEmpty()
  regionId: string;
}
