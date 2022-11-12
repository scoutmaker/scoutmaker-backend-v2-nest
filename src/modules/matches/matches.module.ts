import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { OrganizationSubscriptionsService } from '../organization-subscriptions/organization-subscriptions.service';
import { UserSubscriptionsService } from '../user-subscriptions/user-subscriptions.service';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

@Module({
  controllers: [MatchesController],
  providers: [
    MatchesService,
    UserSubscriptionsService,
    OrganizationSubscriptionsService,
  ],
})
export class MatchesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'matches', method: RequestMethod.GET });
  }
}
