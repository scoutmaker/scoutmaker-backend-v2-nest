import { PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { PlayerPositionTypeDto } from '../../player-position-types/dto/player-position-type.dto';

export class PlayerRoleDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  altName: string;

  @Expose()
  description: string;

  @Transform(({ value }) =>
    plainToInstance(PlayerPositionTypeDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  positionType: PlayerPositionTypeDto;
}

export class PlayerRoleBasicDataDto extends PickType(PlayerRoleDto, [
  'id',
  'name',
]) {}
