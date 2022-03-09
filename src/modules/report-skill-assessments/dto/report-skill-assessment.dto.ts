import { Expose, plainToInstance, Transform } from 'class-transformer';

import { ReportSkillAssessmentTemplateDto } from '../../report-skill-assessment-templates/dto/report-skill-assessment-template.dto';

export class ReportSkillAssessmentDto {
  @Expose()
  id: string;

  @Expose()
  rating?: number;

  @Expose()
  description?: string;

  @Transform(({ value }) =>
    plainToInstance(ReportSkillAssessmentDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  template: ReportSkillAssessmentTemplateDto;

  // @Transform(({ value }) =>
  //   plainToInstance(ReportSkillAssessmentDto, value, {
  //     excludeExtraneousValues: true,
  //   }),
  // )
  @Expose()
  report: any;
}
