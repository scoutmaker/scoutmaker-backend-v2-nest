import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { featureServiceName } from '../../common/guards/admin-or-author.guard';
import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { MatchesService } from '../matches/matches.service';
import { OrganizationNoteAclService } from '../organization-note-acl/organization-note-acl.service';
import { OrganizationSubscriptionsService } from '../organization-subscriptions/organization-subscriptions.service';
import { PlayersModule } from '../players/players.module';
import { TeamAffiliationsService } from '../team-affiliations/team-affiliations.service';
import { UserNoteAclService } from '../user-note-acl/user-note-acl.service';
import { UserSubscriptionsService } from '../user-subscriptions/user-subscriptions.service';
import { UsersService } from '../users/users.service';
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
    UsersService,
    MatchesService,
    TeamAffiliationsService,
    { provide: featureServiceName, useExisting: NotesService },
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
