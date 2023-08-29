import { Module } from '@nestjs/common';

import { MatchesService } from '../matches/matches.service';
import { NotesService } from '../notes/notes.service';
import { PlayersModule } from '../players/players.module';
import { ReportTemplatesModule } from '../report-templates/report-templates.module';
import { ReportsService } from '../reports/reports.service';
import { TeamAffiliationsService } from '../team-affiliations/team-affiliations.service';
import { TeamsService } from '../teams/teams.service';
import { UsersService } from '../users/users.service';
import { LandingController } from './landing.controller';
import { LandingService } from './landing.service';

@Module({
  controllers: [LandingController],
  providers: [
    LandingService,
    NotesService,
    ReportsService,
    UsersService,
    MatchesService,
    TeamAffiliationsService,
    TeamsService,
  ],
  imports: [ReportTemplatesModule, PlayersModule],
})
export class LandingModule {}
