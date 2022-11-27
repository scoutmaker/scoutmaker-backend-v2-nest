import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { UserFootballRolesController } from './user-football-roles.controller';
import { UserFootballRolesService } from './user-football-roles.service';

@Module({
  controllers: [UserFootballRolesController],
  providers: [UserFootballRolesService],
})
export class UserFootballRolesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'user-football-roles',
      method: RequestMethod.GET,
    });
  }
}
