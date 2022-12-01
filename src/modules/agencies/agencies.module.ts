import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { featureServiceName } from '../../common/guards/admin-or-author.guard';
import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { AgenciesController } from './agencies.controller';
import { AgenciesService } from './agencies.service';

@Module({
  controllers: [AgenciesController],
  providers: [
    AgenciesService,
    { provide: featureServiceName, useExisting: AgenciesService },
  ],
})
export class AgenciesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'agencies', method: RequestMethod.GET });
  }
}
