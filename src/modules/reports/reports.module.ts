import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { featureServiceName } from '../../common/guards/admin-or-author.guard';
import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { MatchesService } from '../matches/matches.service';
import { OrganizationReportAclService } from '../organization-report-acl/organization-report-acl.service';
import { OrganizationSubscriptionsService } from '../organization-subscriptions/organization-subscriptions.service';
import { PlayersModule } from '../players/players.module';
import { ReportTemplatesModule } from '../report-templates/report-templates.module';
import { TeamAffiliationsService } from '../team-affiliations/team-affiliations.service';
import { TeamsService } from '../teams/teams.service';
import { UserReportAclService } from '../user-report-acl/user-report-acl.service';
import { UserSubscriptionsService } from '../user-subscriptions/user-subscriptions.service';
import { UsersService } from '../users/users.service';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  controllers: [ReportsController],
  providers: [
    ReportsService,
    UserSubscriptionsService,
    OrganizationSubscriptionsService,
    UserReportAclService,
    OrganizationReportAclService,
    UsersService,
    MatchesService,
    TeamAffiliationsService,
    TeamsService,
    { provide: featureServiceName, useExisting: ReportsService },
  ],
  imports: [ReportTemplatesModule, PlayersModule],
})
export class ReportsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'reports', method: RequestMethod.GET });
  }
}
