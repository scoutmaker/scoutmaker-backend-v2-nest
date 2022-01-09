import { UserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class ChangeRoleDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(UserRole)
  role: UserRole;
}
