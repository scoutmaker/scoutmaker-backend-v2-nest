import { IsEnum, IsOptional } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';
import { AccessControlEntryPermissionLevelEnum } from '../../../types/common';

export class CreateUserReportAceDto {
  @IsCuid()
  userId: string;

  @IsCuid()
  reportId: string;

  @IsOptional()
  @IsEnum(AccessControlEntryPermissionLevelEnum, {
    message: `Permission level must be a valid enum value. Available values: ${Object.keys(
      AccessControlEntryPermissionLevelEnum,
    ).join(', ')}`,
  })
  permissionLevel?: AccessControlEntryPermissionLevelEnum;
}
