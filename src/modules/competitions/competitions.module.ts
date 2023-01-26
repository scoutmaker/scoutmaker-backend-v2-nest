import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { featureServiceName } from '../../common/guards/admin-or-author.guard';
import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { CompetitionsController } from './competitions.controller';
import { CompetitionsService } from './competitions.service';

@Module({
  controllers: [CompetitionsController],
  providers: [
    CompetitionsService,
    { provide: featureServiceName, useExisting: CompetitionsService },
  ],
})
export class CompetitionsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'competitions', method: RequestMethod.GET });
  }
}
