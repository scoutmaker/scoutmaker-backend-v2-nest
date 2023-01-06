import { PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { PlayerRoleBasicDataDto } from '../../player-roles/dto/player-role.dto';

export class PlayerRoleExampleDto {
  @Expose()
  id: string;

  @Expose()
  player: string;

  @Expose()
  type: string;

  @Transform(({ value }) =>
    plainToInstance(PlayerRoleBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  role: PlayerRoleBasicDataDto;
}

export class PlayerRoleExampleBasicDataDto extends PickType(
  PlayerRoleExampleDto,
  ['id', 'player', 'role'],
) {}
