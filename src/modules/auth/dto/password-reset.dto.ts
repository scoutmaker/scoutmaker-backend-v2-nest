import { IsString, Matches, MinLength } from 'class-validator';

import { MatchesProperty } from '../../../common/decorators/matches-property.decorator';
import { PASSWORD_REGEXP } from '../../../utils/constants';

export class PasswordResetDto {
  @IsString()
  @MinLength(6)
  @Matches(PASSWORD_REGEXP, {
    message:
      'Password must contain at least 1 lowercase letter, 1 uppercase letter and 1 digit',
  })
  password: string;

  @IsString()
  @MinLength(6)
  @MatchesProperty(PasswordResetDto, (s) => s.password, {
    message: 'Passwords do not match',
  })
  passwordConfirm: string;
}
