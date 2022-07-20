import { IsInt, IsOptional } from 'class-validator';

export class FindAllReportSkillAssessmentsDto {
  @IsOptional()
  @IsInt()
  playerId?: string;

  @IsOptional()
  @IsInt()
  matchId?: string;
}
