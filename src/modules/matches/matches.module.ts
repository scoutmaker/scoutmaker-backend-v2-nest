import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'matches', method: RequestMethod.GET });
  }
}
