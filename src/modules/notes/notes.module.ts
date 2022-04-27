import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { OrganizationNoteAclService } from '../organization-note-acl/organization-note-acl.service';
import { OrganizationSubscriptionsService } from '../organization-subscriptions/organization-subscriptions.service';
import { PlayersModule } from '../players/players.module';
import { UserNoteAclService } from '../user-note-acl/user-note-acl.service';
import { UserSubscriptionsService } from '../user-subscriptions/user-subscriptions.service';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  controllers: [NotesController],
  providers: [
    NotesService,
    UserSubscriptionsService,
    OrganizationSubscriptionsService,
    UserNoteAclService,
    OrganizationNoteAclService,
  ],
  imports: [PlayersModule],
})
export class NotesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'notes', method: RequestMethod.GET });
  }
}
