import { IsInt, IsOptional, Max, Min } from 'class-validator';

import { IsCuid } from '../../../common/decorators/is-cuid.decorator';

export class CreatePlayerStatsDto {
  @IsCuid()
  playerId: number;

  @IsCuid()
  matchId: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(120)
  minutesPlayed?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  goals?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  assists?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(2)
  yellowCards?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  redCards?: number;

  @IsOptional()
  @IsCuid()
  teamId?: string;
}
