import { Module } from '@nestjs/common';
import { ReportSkillAssessmentTemplatesService } from './report-skill-assessment-templates.service';
import { ReportSkillAssessmentTemplatesController } from './report-skill-assessment-templates.controller';

@Module({
  controllers: [ReportSkillAssessmentTemplatesController],
  providers: [ReportSkillAssessmentTemplatesService]
})
export class ReportSkillAssessmentTemplatesModule {}
