import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../middleware/prepare-query.middleware';
import { OrganizationSubscriptionsService } from '../organization-subscriptions/organization-subscriptions.service';
import { PlayersModule } from '../players/players.module';
import { UserSubscriptionsService } from '../user-subscriptions/user-subscriptions.service';
import { InsiderNotesController } from './insider-notes.controller';
import { InsiderNotesService } from './insider-notes.service';

@Module({
  controllers: [InsiderNotesController],
  providers: [
    InsiderNotesService,
    UserSubscriptionsService,
    OrganizationSubscriptionsService,
  ],
  imports: [PlayersModule],
})
export class InsiderNotesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'insider-notes', method: RequestMethod.GET });
  }
}
