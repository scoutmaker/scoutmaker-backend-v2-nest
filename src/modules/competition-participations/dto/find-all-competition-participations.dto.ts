import { IsOptional, IsString } from 'class-validator';

export class FindAllCompetitionParticipationsDto {
  @IsOptional()
  @IsString()
  seasonId?: string;

  @IsOptional()
  @IsString()
  teamId?: string;

  @IsOptional()
  @IsString()
  competitionId?: string;

  @IsOptional()
  @IsString()
  groupId?: string;
}
