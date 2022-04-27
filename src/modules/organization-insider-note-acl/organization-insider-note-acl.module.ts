import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { OrganizationInsiderNoteAclController } from './organization-insider-note-acl.controller';
import { OrganizationInsiderNoteAclService } from './organization-insider-note-acl.service';

@Module({
  controllers: [OrganizationInsiderNoteAclController],
  providers: [OrganizationInsiderNoteAclService],
})
export class OrganizationInsiderNoteAclModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'organization-insider-note-acl',
      method: RequestMethod.GET,
    });
  }
}
