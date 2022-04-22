import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { OrganizationPlayerAclService } from '../organization-player-acl/organization-player-acl.service';
import { OrganizationSubscriptionsService } from '../organization-subscriptions/organization-subscriptions.service';
import { UserPlayerAclService } from '../user-player-acl/user-player-acl.service';
import { UserSubscriptionsService } from '../user-subscriptions/user-subscriptions.service';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
  controllers: [PlayersController],
  providers: [
    PlayersService,
    UserSubscriptionsService,
    OrganizationSubscriptionsService,
    UserPlayerAclService,
    OrganizationPlayerAclService,
  ],
  exports: [PlayersService],
})
export class PlayersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'players', method: RequestMethod.GET });
  }
}
