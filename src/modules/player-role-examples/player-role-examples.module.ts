import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { PlayerRoleExamplesController } from './player-role-examples.controller';
import { PlayerRoleExamplesService } from './player-role-examples.service';

@Module({
  controllers: [PlayerRoleExamplesController],
  providers: [PlayerRoleExamplesService],
})
export class PlayerRoleExamplesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'player-role-examples',
      method: RequestMethod.GET,
    });
  }
}
