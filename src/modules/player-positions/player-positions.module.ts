import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { PlayerPositionsController } from './player-positions.controller';
import { PlayerPositionsService } from './player-positions.service';

@Module({
  controllers: [PlayerPositionsController],
  providers: [PlayerPositionsService],
})
export class PlayerPositionsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'player-positions',
      method: RequestMethod.GET,
    });
  }
}
