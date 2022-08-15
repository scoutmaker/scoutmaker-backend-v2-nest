import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { ReportSkillAssessmentCategoriesController } from './report-skill-assessment-categories.controller';
import { ReportSkillAssessmentCategoriesService } from './report-skill-assessment-categories.service';

@Module({
  controllers: [ReportSkillAssessmentCategoriesController],
  providers: [ReportSkillAssessmentCategoriesService],
})
export class ReportSkillAssessmentCategoriesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'report-skill-assessment-categories',
      method: RequestMethod.GET,
    });
  }
}
