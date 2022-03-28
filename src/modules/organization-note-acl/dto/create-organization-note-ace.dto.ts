import { IsEnum, IsOptional } from 'class-validator';

import { IsCuid } from '../../../decorators/is-cuid.decorator';
import { AccessControlEntryPermissionLevelEnum } from '../../../types/common';

export class CreateOrganizationNoteAceDto {
  @IsCuid()
  organizationId: string;

  @IsCuid()
  noteId: string;

  @IsOptional()
  @IsEnum(AccessControlEntryPermissionLevelEnum, {
    message: `Permission level must be a valid enum value. Available values: ${Object.keys(
      AccessControlEntryPermissionLevelEnum,
    ).join(', ')}`,
  })
  permissionLevel?: AccessControlEntryPermissionLevelEnum;
}
