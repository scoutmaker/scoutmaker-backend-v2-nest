import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { featureServiceName } from '../../common/guards/admin-or-author.guard';
import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { ReportTemplatesController } from './report-templates.controller';
import { ReportTemplatesService } from './report-templates.service';

@Module({
  controllers: [ReportTemplatesController],
  providers: [
    ReportTemplatesService,
    { provide: featureServiceName, useExisting: ReportTemplatesService },
  ],
  exports: [ReportTemplatesService],
})
export class ReportTemplatesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'report-templates',
      method: RequestMethod.GET,
    });
  }
}
