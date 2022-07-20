import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class CreatePlayerStatsDto {
  @IsInt()
  playerId: number;

  @IsInt()
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
  @IsInt()
  teamId?: number;
}
