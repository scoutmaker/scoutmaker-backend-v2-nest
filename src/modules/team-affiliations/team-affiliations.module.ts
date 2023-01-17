import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { featureServiceName } from '../../common/guards/admin-or-author.guard';
import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { PlayersService } from '../players/players.service';
import { TeamAffiliationsController } from './team-affiliations.controller';
import { TeamAffiliationsService } from './team-affiliations.service';

@Module({
  controllers: [TeamAffiliationsController],
  providers: [
    TeamAffiliationsService,
    PlayersService,
    { provide: featureServiceName, useExisting: TeamAffiliationsService },
  ],
})
export class TeamAffiliationsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'team-affiliations',
      method: RequestMethod.GET,
    });
  }
}
