import { IsInt, IsOptional } from 'class-validator';

export class FindAllTeamAffiliationsDto {
  @IsOptional()
  @IsInt()
  playerId?: string;

  @IsOptional()
  @IsInt()
  teamId?: string;
}
