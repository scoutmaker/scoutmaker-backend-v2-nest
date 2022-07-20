import { IsInt, IsOptional } from 'class-validator';

export class FindAllPlayerStatsDto {
  @IsOptional()
  @IsInt()
  playerId?: string;

  @IsOptional()
  @IsInt()
  teamId?: string;

  @IsOptional()
  @IsInt()
  matchId?: string;
}
