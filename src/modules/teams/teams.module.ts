import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'teams', method: RequestMethod.GET });
  }
}
