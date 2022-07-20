import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FindAllPlayerStatsDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  playerId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  teamId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  matchId?: number;
}
