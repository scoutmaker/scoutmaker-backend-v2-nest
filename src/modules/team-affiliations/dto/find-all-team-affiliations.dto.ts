import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FindAllTeamAffiliationsDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  playerId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  teamId?: number;
}
