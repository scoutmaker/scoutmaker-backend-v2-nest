import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CompetitionsService } from './competitions.service';
import { CompetitionsController } from './competitions.controller';
import { PrepareQueryMiddleware } from '../../middleware/prepare-query.middleware';

@Module({
  controllers: [CompetitionsController],
  providers: [CompetitionsService],
})
export class CompetitionsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'competitions', method: RequestMethod.GET });
  }
}
