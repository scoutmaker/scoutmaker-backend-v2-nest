import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreatePlayerStatsDto {
  @IsString()
  playerId: string;

  @IsString()
  matchId: string;

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
  @IsString()
  teamId?: string;
}
