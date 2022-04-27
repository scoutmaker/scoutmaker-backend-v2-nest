import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { ReportSkillAssessmentsController } from './report-skill-assessments.controller';
import { ReportSkillAssessmentsService } from './report-skill-assessments.service';

@Module({
  controllers: [ReportSkillAssessmentsController],
  providers: [ReportSkillAssessmentsService],
})
export class ReportSkillAssessmentsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'report-skill-assessments',
      method: RequestMethod.GET,
    });
  }
}
