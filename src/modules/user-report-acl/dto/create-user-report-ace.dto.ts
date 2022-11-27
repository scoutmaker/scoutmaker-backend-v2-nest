import { IsEnum, IsOptional, IsString } from 'class-validator';

import { AccessControlEntryPermissionLevelEnum } from '../../../types/common';

export class CreateUserReportAceDto {
  @IsString()
  userId: string;

  @IsString()
  reportId: string;

  @IsOptional()
  @IsEnum(AccessControlEntryPermissionLevelEnum, {
    message: `Permission level must be a valid enum value. Available values: ${Object.keys(
      AccessControlEntryPermissionLevelEnum,
    ).join(', ')}`,
  })
  permissionLevel?: AccessControlEntryPermissionLevelEnum;
}
