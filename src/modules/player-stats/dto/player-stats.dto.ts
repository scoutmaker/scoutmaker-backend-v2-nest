import { Expose, plainToInstance, Transform } from 'class-transformer';

import { MatchBasicDataDto } from '../../matches/dto/match.dto';
import { PlayerBasicDataDto } from '../../players/dto/player.dto';

export class PlayerStatsDto {
  @Expose()
  id: string;

  @Transform(({ value }) =>
    plainToInstance(PlayerBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  player: PlayerBasicDataDto;

  @Transform(({ value }) =>
    plainToInstance(MatchBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  match: MatchBasicDataDto;

  @Expose()
  minutesPlayed: number;

  @Expose()
  goals: number;

  @Expose()
  assists: number;

  @Expose()
  yellowCards: number;

  @Expose()
  redCards: number;
}
