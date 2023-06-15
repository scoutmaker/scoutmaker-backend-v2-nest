import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { featureServiceName } from '../../common/guards/admin-or-author.guard';
import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { PlayersModule } from '../players/players.module';
import { PlayerGradesController } from './player-grades.controller';
import { PlayerGradesService } from './player-grades.service';

@Module({
  controllers: [PlayerGradesController],
  providers: [
    PlayerGradesService,
    { provide: featureServiceName, useExisting: PlayerGradesService },
  ],
  imports: [PlayersModule],
})
export class PlayerGradesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'player-grades',
      method: RequestMethod.GET,
    });
  }
}
