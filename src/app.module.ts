import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ClubsModule } from './modules/clubs/clubs.module';
import { CompetitionAgeCategoriesModule } from './modules/competition-age-categories/competition-age-categories.module';
import { CompetitionGroupsModule } from './modules/competition-groups/competition-groups.module';
import { CompetitionJuniorLevelsModule } from './modules/competition-junior-levels/competition-junior-levels.module';
import { CompetitionParticipationsModule } from './modules/competition-participations/competition-participations.module';
import { CompetitionTypesModule } from './modules/competition-types/competition-types.module';
import { CompetitionsModule } from './modules/competitions/competitions.module';
import { CountriesModule } from './modules/countries/countries.module';
import { MatchesModule } from './modules/matches/matches.module';
import { NotesModule } from './modules/notes/notes.module';
import { PlayerPositionsModule } from './modules/player-positions/player-positions.module';
import { PlayersModule } from './modules/players/players.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RegionsModule } from './modules/regions/regions.module';
import { SeasonsModule } from './modules/seasons/seasons.module';
import { TeamAffiliationsModule } from './modules/team-affiliations/team-affiliations.module';
import { TeamsModule } from './modules/teams/teams.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
