import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { CompetitionGroupsController } from './competition-groups.controller';
import { CompetitionGroupsService } from './competition-groups.service';

@Module({
  controllers: [CompetitionGroupsController],
  providers: [CompetitionGroupsService],
})
export class CompetitionGroupsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'competition-groups', method: RequestMethod.GET });
  }
}
