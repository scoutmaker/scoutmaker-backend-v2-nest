import { Module } from '@nestjs/common';

import { MatchesService } from '../matches/matches.service';
import { NotesService } from '../notes/notes.service';
import { OrganizationSubscriptionsService } from '../organization-subscriptions/organization-subscriptions.service';
import { PlayersModule } from '../players/players.module';
import { PlayersService } from '../players/players.service';
import { ReportTemplatesModule } from '../report-templates/report-templates.module';
import { ReportsService } from '../reports/reports.service';
import { UsersService } from '../users/users.service';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    OrganizationSubscriptionsService,
    ReportsService,
    NotesService,
    MatchesService,
    PlayersService,
    UsersService,
  ],
  imports: [ReportTemplatesModule, PlayersModule],
})
export class DashboardModule {}
