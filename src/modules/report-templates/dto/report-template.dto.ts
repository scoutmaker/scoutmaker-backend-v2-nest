import { PickType } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { ReportSkillAssessmentTemplateDto } from '../../report-skill-assessment-templates/dto/report-skill-assessment-template.dto';

export class ReportTemplateDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  maxRatingScore: number;

  @Transform(({ value }) =>
    value.map((item) =>
      plainToInstance(
        ReportSkillAssessmentTemplateDto,
        item.skillAssessmentTemplate,
        {
          excludeExtraneousValues: true,
        },
      ),
    ),
  )
  @Expose()
  skillAssessmentTemplates: ReportSkillAssessmentTemplateDto[];
}

export class ReportTemplateBasicDataDto extends PickType(ReportTemplateDto, [
  'id',
  'name',
  'maxRatingScore',
]) {}
