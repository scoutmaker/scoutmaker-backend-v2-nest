import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { OrganizationNoteAclController } from './organization-note-acl.controller';
import { OrganizationNoteAclService } from './organization-note-acl.service';

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
