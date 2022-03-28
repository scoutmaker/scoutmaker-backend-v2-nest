import { Expose, plainToInstance, Transform } from 'class-transformer';

import { AccessControlEntryPermissionLevelEnum } from '../../../types/common';
import { InsiderNoteSuperBasicDataDto } from '../../insider-notes/dto/insider-note.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

export class UserInsiderNoteAceDto {
  @Expose()
  id: string;

  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  user: UserBasicDataDto;

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
