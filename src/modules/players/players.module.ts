import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../middleware/prepare-query.middleware';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'players', method: RequestMethod.GET });
  }
}
