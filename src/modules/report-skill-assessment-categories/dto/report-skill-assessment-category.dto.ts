import { Expose } from 'class-transformer';

export class ReportSkillAssessmentCategoryDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
