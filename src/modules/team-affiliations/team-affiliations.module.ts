import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { TeamAffiliationsController } from './team-affiliations.controller';
import { TeamAffiliationsService } from './team-affiliations.service';

@Module({
  controllers: [TeamAffiliationsController],
  providers: [TeamAffiliationsService],
})
export class TeamAffiliationsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'team-affiliations',
      method: RequestMethod.GET,
    });
  }
}
