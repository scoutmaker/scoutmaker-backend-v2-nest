import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { PlayerRolesController } from './player-roles.controller';
import { PlayerRolesService } from './player-roles.service';

@Module({
  controllers: [PlayerRolesController],
  providers: [PlayerRolesService],
})
export class PlayerRolesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'player-roles',
      method: RequestMethod.GET,
    });
  }
}
