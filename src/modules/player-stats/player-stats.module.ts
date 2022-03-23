import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../middleware/prepare-query.middleware';
import { PlayersModule } from '../players/players.module';
import { PlayerStatsController } from './player-stats.controller';
import { PlayerStatsService } from './player-stats.service';

@Module({
  controllers: [PlayerStatsController],
  providers: [PlayerStatsService],
  imports: [PlayersModule],
})
export class PlayerStatsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'player-stats', method: RequestMethod.GET });
  }
}
