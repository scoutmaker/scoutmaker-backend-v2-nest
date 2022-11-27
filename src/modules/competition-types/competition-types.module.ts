import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { CompetitionTypesController } from './competition-types.controller';
import { CompetitionTypesService } from './competition-types.service';

@Module({
  controllers: [CompetitionTypesController],
  providers: [CompetitionTypesService],
})
export class CompetitionTypesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'competition-types', method: RequestMethod.GET });
  }
}
