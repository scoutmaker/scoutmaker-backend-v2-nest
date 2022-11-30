import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { AgenciesController } from './agencies.controller';
import { AgenciesService } from './agencies.service';

@Module({
  controllers: [AgenciesController],
  providers: [
    AgenciesService,
    { provide: 'FeatureService', useExisting: AgenciesService },
  ],
})
export class AgenciesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'agencies', method: RequestMethod.GET });
  }
}
