import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateReportSkillAssessmentCategoryDto } from './create-report-skill-assessment-category.dto';

export class UpdateReportSkillAssessmentCategoryDto extends PartialType(
  OmitType(CreateReportSkillAssessmentCategoryDto, ['id']),
) {}
