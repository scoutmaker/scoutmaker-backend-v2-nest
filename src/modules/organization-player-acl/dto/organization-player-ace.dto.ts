import { Expose, plainToInstance, Transform } from 'class-transformer';

import { AccessControlEntryPermissionLevelEnum } from '../../../types/common';
import { OrganizationBasicDataDto } from '../../organizations/dto/organization.dto';
import { PlayerSuperBasicDataDto } from '../../players/dto/player.dto';

export class OrganizationPlayerAceDto {
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
    plainToInstance(PlayerSuperBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  player: PlayerSuperBasicDataDto;

  @Expose()
  permissionLevel: AccessControlEntryPermissionLevelEnum;

  @Expose()
  createdAt: Date;
}
