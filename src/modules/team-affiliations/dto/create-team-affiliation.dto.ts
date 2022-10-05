import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTeamAffiliationDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  playerId: string;

  @IsString()
  teamId: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
