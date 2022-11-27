import { IsOptional, IsString } from 'class-validator';

export class FindAllPlayerStatsDto {
  @IsOptional()
  @IsString()
  playerId?: string;

  @IsOptional()
  @IsString()
  teamId?: string;

  @IsOptional()
  @IsString()
  matchId?: string;
}
