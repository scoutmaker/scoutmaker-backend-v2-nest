import { IsInt, IsOptional } from 'class-validator';

export class FindAllPlayerStatsDto {
  @IsOptional()
  @IsInt()
  playerId?: number;

  @IsOptional()
  @IsInt()
  teamId?: number;

  @IsOptional()
  @IsInt()
  matchId?: number;
}
