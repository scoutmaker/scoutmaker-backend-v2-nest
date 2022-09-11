import { IsArray, IsOptional, IsString } from 'class-validator';

export class FindAllReportSkillAssessmentTemplatesDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];
}
