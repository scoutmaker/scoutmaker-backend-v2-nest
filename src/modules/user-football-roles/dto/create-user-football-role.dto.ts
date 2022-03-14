import { IsRequiredStringWithMaxLength } from '../../../decorators/is-required-string-with-max-length.decorator';

export class CreateUserFootballRoleDto {
  @IsRequiredStringWithMaxLength(30)
  name: string;
}
