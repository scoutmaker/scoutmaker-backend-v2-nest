import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { ClubsController } from './clubs.controller';
import { PrepareQueryMiddleware } from '../../middleware/prepare-query.middleware';

@Module({
  controllers: [ClubsController],
  providers: [ClubsService],
})
export class ClubsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'teams', method: RequestMethod.GET });
  }
}
