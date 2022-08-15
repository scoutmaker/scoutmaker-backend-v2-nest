import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { CompetitionAgeCategoriesController } from './competition-age-categories.controller';
import { CompetitionAgeCategoriesService } from './competition-age-categories.service';

@Module({
  controllers: [CompetitionAgeCategoriesController],
  providers: [CompetitionAgeCategoriesService],
})
export class CompetitionAgeCategoriesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'competition-age-categories',
      method: RequestMethod.GET,
    });
  }
}
