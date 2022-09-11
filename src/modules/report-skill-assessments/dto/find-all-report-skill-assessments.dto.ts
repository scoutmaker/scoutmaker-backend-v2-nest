import { IsOptional, IsString } from 'class-validator';

export class FindAllReportSkillAssessmentsDto {
  @IsOptional()
  @IsString()
  playerId?: string;

  @IsOptional()
  @IsString()
  matchId?: string;
}
