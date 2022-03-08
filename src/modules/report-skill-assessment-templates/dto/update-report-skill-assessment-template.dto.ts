import { PartialType } from '@nestjs/swagger';
import { CreateReportSkillAssessmentTemplateDto } from './create-report-skill-assessment-template.dto';

export class UpdateReportSkillAssessmentTemplateDto extends PartialType(CreateReportSkillAssessmentTemplateDto) {}
