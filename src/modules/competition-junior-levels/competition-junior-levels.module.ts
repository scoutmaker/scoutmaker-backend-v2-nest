import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { CompetitionJuniorLevelsController } from './competition-junior-levels.controller';
import { CompetitionJuniorLevelsService } from './competition-junior-levels.service';

@Module({
  controllers: [CompetitionJuniorLevelsController],
  providers: [CompetitionJuniorLevelsService],
})
export class CompetitionJuniorLevelsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'competition-junior-levels',
      method: RequestMethod.GET,
    });
  }
}
