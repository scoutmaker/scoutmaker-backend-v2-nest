import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nJsonLoader,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgenciesModule } from './modules/agencies/agencies.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClubsModule } from './modules/clubs/clubs.module';
import { CompetitionAgeCategoriesModule } from './modules/competition-age-categories/competition-age-categories.module';
import { CompetitionGroupsModule } from './modules/competition-groups/competition-groups.module';
import { CompetitionJuniorLevelsModule } from './modules/competition-junior-levels/competition-junior-levels.module';
import { CompetitionParticipationsModule } from './modules/competition-participations/competition-participations.module';
import { CompetitionTypesModule } from './modules/competition-types/competition-types.module';
import { CompetitionsModule } from './modules/competitions/competitions.module';
import { CountriesModule } from './modules/countries/countries.module';
import { FollowAgenciesModule } from './modules/follow-agencies/follow-agencies.module';
import { FollowPlayersModule } from './modules/follow-players/follow-players.module';
import { FollowScoutsModule } from './modules/follow-scouts/follow-scouts.module';
import { FollowTeamsModule } from './modules/follow-teams/follow-teams.module';
import { InsiderNotesModule } from './modules/insider-notes/insider-notes.module';
import { MatchesModule } from './modules/matches/matches.module';
import { NotesModule } from './modules/notes/notes.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OrganizationInsiderNoteAclModule } from './modules/organization-insider-note-acl/organization-insider-note-acl.module';
import { OrganizationNoteAclModule } from './modules/organization-note-acl/organization-note-acl.module';
import { OrganizationPlayerAclModule } from './modules/organization-player-acl/organization-player-acl.module';
import { OrganizationReportAclModule } from './modules/organization-report-acl/organization-report-acl.module';
import { OrganizationSubscriptionsModule } from './modules/organization-subscriptions/organization-subscriptions.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { PlayerPositionsModule } from './modules/player-positions/player-positions.module';
import { PlayerStatsModule } from './modules/player-stats/player-stats.module';
import { PlayersModule } from './modules/players/players.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RegionsModule } from './modules/regions/regions.module';
import { ReportBackgroundImagesModule } from './modules/report-background-images/report-background-images.module';
import { ReportSkillAssessmentCategoriesModule } from './modules/report-skill-assessment-categories/report-skill-assessment-categories.module';
import { ReportSkillAssessmentTemplatesModule } from './modules/report-skill-assessment-templates/report-skill-assessment-templates.module';
import { ReportSkillAssessmentsModule } from './modules/report-skill-assessments/report-skill-assessments.module';
import { ReportTemplatesModule } from './modules/report-templates/report-templates.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SeasonsModule } from './modules/seasons/seasons.module';
import { TeamAffiliationsModule } from './modules/team-affiliations/team-affiliations.module';
import { TeamsModule } from './modules/teams/teams.module';
import { UserFootballRolesModule } from './modules/user-football-roles/user-football-roles.module';
import { UserInsiderNoteAclModule } from './modules/user-insider-note-acl/user-insider-note-acl.module';
import { UserNoteAclModule } from './modules/user-note-acl/user-note-acl.module';
import { UserPlayerAclModule } from './modules/user-player-acl/user-player-acl.module';
import { UserReportAclModule } from './modules/user-report-acl/user-report-acl.module';
import { UserSubscriptionsModule } from './modules/user-subscriptions/user-subscriptions.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale', 'l'] },
        new HeaderResolver(['x-custom-lang']),
        { use: AcceptLanguageResolver, options: { matchType: 'strict-loose' } },
        new CookieResolver(['lang', 'locale', 'l']),
      ],
    }),
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        config: {
          url: configService.get('REDIS_URL'),
          tls: { rejectUnauthorized: false },
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    CountriesModule,
    RegionsModule,
    UsersModule,
    AuthModule,
    ClubsModule,
    SeasonsModule,
    CompetitionsModule,
    TeamsModule,
    CompetitionAgeCategoriesModule,
    CompetitionTypesModule,
    CompetitionJuniorLevelsModule,
    CompetitionParticipationsModule,
    CompetitionGroupsModule,
    PlayerPositionsModule,
    PlayersModule,
    TeamAffiliationsModule,
    MatchesModule,
    NotesModule,
    InsiderNotesModule,
    ReportSkillAssessmentCategoriesModule,
    ReportSkillAssessmentTemplatesModule,
    ReportTemplatesModule,
    ReportSkillAssessmentsModule,
    ReportsModule,
    OrdersModule,
    AgenciesModule,
    FollowPlayersModule,
    FollowTeamsModule,
    FollowScoutsModule,
    FollowAgenciesModule,
    UserFootballRolesModule,
    OrganizationsModule,
    PlayerStatsModule,
    ReportBackgroundImagesModule,
    UserSubscriptionsModule,
    OrganizationSubscriptionsModule,
    UserPlayerAclModule,
    OrganizationPlayerAclModule,
    UserReportAclModule,
    OrganizationReportAclModule,
    UserNoteAclModule,
    OrganizationNoteAclModule,
    UserInsiderNoteAclModule,
    OrganizationInsiderNoteAclModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
