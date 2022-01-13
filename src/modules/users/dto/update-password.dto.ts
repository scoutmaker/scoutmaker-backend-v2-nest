import { IsString, Matches, MinLength } from 'class-validator';
import { MatchesProperty } from '../../../decorators/matches-property.decorator';
import { PASSWORD_REGEXP } from '../../../utils/constants';

export class UpdatePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(6)
  @Matches(PASSWORD_REGEXP, {
    message:
      'Password must contain at least 1 lowercase letter, 1 uppercase letter and 1 digit',
  })
  newPassword: string;

  @IsString()
  @MinLength(6)
  @MatchesProperty(UpdatePasswordDto, (s) => s.newPassword, {
    message: 'Passwords do not match',
  })
  newPasswordConfirm: string;
}
