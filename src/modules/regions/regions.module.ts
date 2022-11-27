import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { RegionsController } from './regions.controller';
import { RegionsService } from './regions.service';

@Module({
  controllers: [RegionsController],
  providers: [RegionsService],
})
export class RegionsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'regions', method: RequestMethod.GET });
  }
}
