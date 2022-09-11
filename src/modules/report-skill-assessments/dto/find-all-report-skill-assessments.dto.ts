import { IsInt, IsOptional } from 'class-validator';

export class FindAllReportSkillAssessmentsDto {
  @IsOptional()
  @IsInt()
  playerId?: number;

  @IsOptional()
  @IsInt()
  matchId?: number;
}
