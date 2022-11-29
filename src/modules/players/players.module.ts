import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { OrganizationInsiderNoteAclService } from '../organization-insider-note-acl/organization-insider-note-acl.service';
import { OrganizationNoteAclService } from '../organization-note-acl/organization-note-acl.service';
import { OrganizationReportAclService } from '../organization-report-acl/organization-report-acl.service';
import { OrganizationSubscriptionsService } from '../organization-subscriptions/organization-subscriptions.service';
import { UserInsiderNoteAclService } from '../user-insider-note-acl/user-insider-note-acl.service';
import { UserNoteAclService } from '../user-note-acl/user-note-acl.service';
import { UserReportAclService } from '../user-report-acl/user-report-acl.service';
import { UserSubscriptionsService } from '../user-subscriptions/user-subscriptions.service';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
  controllers: [PlayersController],
  providers: [
    PlayersService,
    UserSubscriptionsService,
    OrganizationSubscriptionsService,
    UserInsiderNoteAclService,
    UserNoteAclService,
    UserReportAclService,
    OrganizationInsiderNoteAclService,
    OrganizationNoteAclService,
    OrganizationReportAclService,
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
