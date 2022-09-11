import { Expose } from 'class-transformer';

export class ReportSkillAssessmentCategoryDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
