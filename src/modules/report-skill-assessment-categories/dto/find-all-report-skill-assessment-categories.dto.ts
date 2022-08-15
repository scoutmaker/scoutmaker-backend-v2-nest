import { IsOptional, IsString } from 'class-validator';

export class FindAllReportSkillAssessmentCategoriesDto {
  @IsOptional()
  @IsString()
  name?: string;
}
