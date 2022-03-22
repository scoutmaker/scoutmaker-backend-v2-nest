import { IsEnum } from 'class-validator';

import { UserRoleEnum } from '../types';

export class ChangeRoleDto {
  @IsEnum(UserRoleEnum, {
    message: `Role must be a valid enum value. Available values: ${Object.keys(
      UserRoleEnum,
    ).join(', ')}`,
  })
  role: UserRoleEnum;
}
