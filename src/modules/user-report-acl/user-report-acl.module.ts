import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { UserReportAclController } from './user-report-acl.controller';
import { UserReportAclService } from './user-report-acl.service';

@Module({
  controllers: [UserReportAclController],
  providers: [UserReportAclService],
})
export class UserReportAclModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'user-report-acl', method: RequestMethod.GET });
  }
}
