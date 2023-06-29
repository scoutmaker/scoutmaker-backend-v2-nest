import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { featureServiceName } from '../../common/guards/admin-or-author.guard';
import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { PlayersService } from '../players/players.service';
import { TeamAffiliationsService } from '../team-affiliations/team-affiliations.service';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

@Module({
  controllers: [MatchesController],
  providers: [
    MatchesService,
    TeamAffiliationsService,
    PlayersService,
    { provide: featureServiceName, useExisting: MatchesService },
  ],
})
export class MatchesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'matches', method: RequestMethod.GET });
  }
}
