import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FindAllReportSkillAssessmentsDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  playerId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  matchId?: number;
}
