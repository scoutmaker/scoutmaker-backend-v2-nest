import { Expose, plainToInstance, Transform } from 'class-transformer';

import { PlayerPositionTypeDto } from '../../player-position-types/dto/player-position-type.dto';

export class PlayerPositionDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  code: string;

  @Transform(({ value }) =>
    plainToInstance(PlayerPositionTypeDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  positionType: PlayerPositionTypeDto;
}
