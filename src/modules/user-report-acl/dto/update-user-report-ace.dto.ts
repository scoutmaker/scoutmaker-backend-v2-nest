import { IsEnum } from 'class-validator';

import { AccessControlEntryPermissionLevelEnum } from '../../../types/common';

export class UpdateUserReportAceDto {
  @IsEnum(AccessControlEntryPermissionLevelEnum, {
    message: `Permission level must be a valid enum value. Available values: ${Object.keys(
      AccessControlEntryPermissionLevelEnum,
    ).join(', ')}`,
  })
  permissionLevel?: AccessControlEntryPermissionLevelEnum;
}
