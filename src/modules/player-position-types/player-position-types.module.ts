import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { PlayerPositionTypesController } from './player-position-types.controller';
import { PlayerPositionTypesService } from './player-position-types.service';

@Module({
  controllers: [PlayerPositionTypesController],
  providers: [PlayerPositionTypesService],
})
export class PlayerPositionTypesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'player-position-types',
      method: RequestMethod.GET,
    });
  }
}
