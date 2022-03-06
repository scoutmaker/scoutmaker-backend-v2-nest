import { Expose, plainToInstance, Transform } from 'class-transformer';

import { MatchBasicDataDto } from '../../matches/dto/match.dto';
import { PlayerPositionDto } from '../../player-positions/dto/player-position.dto';
import { PlayerBasicDataDto } from '../../players/dto/player.dto';
import { UserBasicDataDto } from '../../users/dto/user.dto';

export class NoteDto {
  @Expose()
  id: string;

  @Expose()
  docNumber: number;

  @Expose()
  shirtNo?: number;

  @Expose()
  description?: string;

  @Expose()
  maxRatingScore?: number;

  @Expose()
  rating?: number;

  @Expose()
  percentageRating?: number;

  @Expose()
  createdAt: Date;

  @Transform(({ value }) =>
    plainToInstance(PlayerBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  player?: PlayerBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(MatchBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  match?: MatchBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(PlayerPositionDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  positionPlayed?: PlayerPositionDto;

  @Transform(({ value }) =>
    plainToInstance(UserBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  author: UserBasicDataDto;
}
