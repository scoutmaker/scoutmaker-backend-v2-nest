import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { featureServiceName } from '../../common/guards/admin-or-author.guard';
import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { OrganizationInsiderNoteAclService } from '../organization-insider-note-acl/organization-insider-note-acl.service';
import { OrganizationSubscriptionsService } from '../organization-subscriptions/organization-subscriptions.service';
import { PlayersModule } from '../players/players.module';
import { UserInsiderNoteAclService } from '../user-insider-note-acl/user-insider-note-acl.service';
import { UserSubscriptionsService } from '../user-subscriptions/user-subscriptions.service';
import { InsiderNotesController } from './insider-notes.controller';
import { InsiderNotesService } from './insider-notes.service';

@Module({
  controllers: [InsiderNotesController],
  providers: [
    InsiderNotesService,
    UserSubscriptionsService,
    OrganizationSubscriptionsService,
    UserInsiderNoteAclService,
    OrganizationInsiderNoteAclService,
    { provide: featureServiceName, useExisting: InsiderNotesService },
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
