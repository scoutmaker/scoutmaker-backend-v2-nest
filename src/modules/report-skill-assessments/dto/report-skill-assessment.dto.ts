import { PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { ReportSkillAssessmentTemplateDto } from '../../report-skill-assessment-templates/dto/report-skill-assessment-template.dto';
import { ReportBasicDataDto } from '../../reports/dto/report.dto';

export class ReportSkillAssessmentDto {
  @Expose()
  id: string;

  @Expose()
  rating?: number;

  @Expose()
  description?: string;

  @Transform(({ value }) =>
    plainToInstance(ReportSkillAssessmentTemplateDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  template: ReportSkillAssessmentTemplateDto;

  @Transform(({ value }) =>
    plainToInstance(ReportBasicDataDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  @Expose()
  report: ReportBasicDataDto;
}

export class ReportSkillAssessmentBasicDataDto extends PickType(
  ReportSkillAssessmentDto,
  ['id', 'rating', 'description', 'template'],
) {}
