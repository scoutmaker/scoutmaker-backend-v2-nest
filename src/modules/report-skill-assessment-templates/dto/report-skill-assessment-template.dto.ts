import { Expose, plainToInstance, Transform } from 'class-transformer';

import { ReportSkillAssessmentCategoryDto } from '../../report-skill-assessment-categories/dto/report-skill-assessment-category.dto';

export class ReportSkillAssessmentTemplateDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  shortName: string;

  @Expose()
  hasScore: boolean;

  @Transform(({ value }) =>
    plainToInstance(ReportSkillAssessmentCategoryDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  category: ReportSkillAssessmentCategoryDto;
}
