import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';
import { MatchesProperty } from '../decorators/matches-property.decorator';

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

  @IsPhoneNumber()
  phone?: string;

  @IsString()
  city?: string;

  @IsString()
  @MinLength(6)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
    message:
      'Password must contain at least 1 lowercase letter, 1 uppercase letter and 1 digit',
  })
  password: string;

  @IsString()
  @MinLength(6)
  @MatchesProperty(RegisterUserDto, (s) => s.password)
  passwordConfirm: string;

  @IsNumber()
  @Min(0)
  activeRadius?: number;

  @IsString()
  @IsNotEmpty()
  regionId: string;
}
