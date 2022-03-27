import { Expose, plainToInstance, Transform } from 'class-transformer';

import { AccessControlEntryPermissionLevelEnum } from '../../../types/common';
import { PlayerBasicDataWithoutTeamsDto } from '../../players/dto/player.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

export class UserPlayerAceDto {
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
    plainToInstance(PlayerBasicDataWithoutTeamsDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  player: PlayerBasicDataWithoutTeamsDto;

  @Expose()
  permissionLevel: AccessControlEntryPermissionLevelEnum;

  @Expose()
  createdAt: Date;
}
