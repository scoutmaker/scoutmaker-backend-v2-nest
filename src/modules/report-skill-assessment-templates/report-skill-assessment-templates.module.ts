import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { ReportSkillAssessmentTemplatesController } from './report-skill-assessment-templates.controller';
import { ReportSkillAssessmentTemplatesService } from './report-skill-assessment-templates.service';

@Module({
  controllers: [ReportSkillAssessmentTemplatesController],
  providers: [ReportSkillAssessmentTemplatesService],
})
export class ReportSkillAssessmentTemplatesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'report-skill-assessment-templates',
      method: RequestMethod.GET,
    });
  }
}
