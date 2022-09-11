import { IsInt, IsOptional } from 'class-validator';

export class FindAllTeamAffiliationsDto {
  @IsOptional()
  @IsInt()
  playerId?: number;

  @IsOptional()
  @IsInt()
  teamId?: number;
}
