import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { OrganizationReportAclController } from './organization-report-acl.controller';
import { OrganizationReportAclService } from './organization-report-acl.service';

@Module({
  controllers: [OrganizationReportAclController],
  providers: [OrganizationReportAclService],
})
export class OrganizationReportAclModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'organization-report-acl',
      method: RequestMethod.GET,
    });
  }
}
