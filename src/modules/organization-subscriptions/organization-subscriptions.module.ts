import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../middleware/prepare-query.middleware';
import { OrganizationSubscriptionsController } from './organization-subscriptions.controller';
import { OrganizationSubscriptionsService } from './organization-subscriptions.service';

@Module({
  controllers: [OrganizationSubscriptionsController],
  providers: [OrganizationSubscriptionsService],
})
export class OrganizationSubscriptionsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'organization-subscriptions',
      method: RequestMethod.GET,
    });
  }
}
