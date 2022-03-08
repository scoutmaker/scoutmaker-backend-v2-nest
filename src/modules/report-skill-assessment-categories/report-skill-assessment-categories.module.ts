import { Module } from '@nestjs/common';
import { ReportSkillAssessmentCategoriesService } from './report-skill-assessment-categories.service';
import { ReportSkillAssessmentCategoriesController } from './report-skill-assessment-categories.controller';

@Module({
  controllers: [ReportSkillAssessmentCategoriesController],
  providers: [ReportSkillAssessmentCategoriesService]
})
export class ReportSkillAssessmentCategoriesModule {}
