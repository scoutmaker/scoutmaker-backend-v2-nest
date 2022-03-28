import { Expose, plainToInstance, Transform } from 'class-transformer';

import { AccessControlEntryPermissionLevelEnum } from '../../../types/common';
import { InsiderNoteSuperBasicDataDto } from '../../insider-notes/dto/insider-note.dto';
import { OrganizationBasicDataDto } from '../../organizations/dto/organization.dto';

export class OrganizationInsiderNoteAceDto {
  @Expose()
  id: string;

  @Transform(({ value }) =>
    plainToInstance(OrganizationBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  organization: OrganizationBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(InsiderNoteSuperBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  insiderNote: InsiderNoteSuperBasicDataDto;

  @Expose()
  permissionLevel: AccessControlEntryPermissionLevelEnum;

  @Expose()
  createdAt: Date;
}
