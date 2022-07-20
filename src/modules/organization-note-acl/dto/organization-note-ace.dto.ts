import { Expose, plainToInstance, Transform } from 'class-transformer';

import { AccessControlEntryPermissionLevelEnum } from '../../../types/common';
import { NoteSuperBasicDataDto } from '../../notes/dto/note.dto';
import { OrganizationBasicDataDto } from '../../organizations/dto/organization.dto';

export class OrganizationNoteAceDto {
  @Expose()
  id: number;

  @Transform(({ value }) =>
    plainToInstance(OrganizationBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  organization: OrganizationBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(NoteSuperBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  note: NoteSuperBasicDataDto;

  @Expose()
  permissionLevel: AccessControlEntryPermissionLevelEnum;

  @Expose()
  createdAt: Date;
}
