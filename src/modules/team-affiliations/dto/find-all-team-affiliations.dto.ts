import { IsOptional, IsString } from 'class-validator';

export class FindAllTeamAffiliationsDto {
  @IsOptional()
  @IsString()
  playerId?: string;

  @IsOptional()
  @IsString()
  teamId?: string;
}
