import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../middleware/prepare-query.middleware';
import { OrganizationPlayerAclController } from './organization-player-acl.controller';
import { OrganizationPlayerAclService } from './organization-player-acl.service';

@Module({
  controllers: [OrganizationPlayerAclController],
  providers: [OrganizationPlayerAclService],
})
export class OrganizationPlayerAclModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'organization-player-acl',
      method: RequestMethod.GET,
    });
  }
}
