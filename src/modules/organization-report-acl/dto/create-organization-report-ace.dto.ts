import { IsEnum, IsOptional } from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';
import { AccessControlEntryPermissionLevelEnum } from '../../../types/common';

export class CreateOrganizationReportAceDto {
  @IsCuid()
  organizationId: number;

  @IsCuid()
  reportId: number;

  @IsOptional()
  @IsEnum(AccessControlEntryPermissionLevelEnum, {
    message: `Permission level must be a valid enum value. Available values: ${Object.keys(
      AccessControlEntryPermissionLevelEnum,
    ).join(', ')}`,
  })
  permissionLevel?: AccessControlEntryPermissionLevelEnum;
}
