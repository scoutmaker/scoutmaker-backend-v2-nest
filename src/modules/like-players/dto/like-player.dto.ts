import { Expose, plainToInstance, Transform } from 'class-transformer';

import { PlayerSuperBasicDataDto } from '../../players/dto/player.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

export class LikePlayerDto {
  @Transform(({ value }) =>
    plainToInstance(PlayerSuperBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  player: PlayerSuperBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  user: UserBasicDataDto;
}

export class LikePlayerBasicDataDto {
  @Expose()
  userId: number;

  @Expose()
  playerId: number;
}
