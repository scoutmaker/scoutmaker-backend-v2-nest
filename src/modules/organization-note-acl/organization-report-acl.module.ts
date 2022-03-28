import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../middleware/prepare-query.middleware';
import { OrganizationNoteAclController } from './organization-report-acl.controller';
import { OrganizationNoteAclService } from './organization-report-acl.service';

@Module({
  controllers: [OrganizationNoteAclController],
  providers: [OrganizationNoteAclService],
})
export class OrganizationNoteAclModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'organization-note-acl',
      method: RequestMethod.GET,
    });
  }
}
