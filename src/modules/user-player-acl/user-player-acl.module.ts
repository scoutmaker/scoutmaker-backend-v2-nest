import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { UserPlayerAclController } from './user-player-acl.controller';
import { UserPlayerAclService } from './user-player-acl.service';

@Module({
  controllers: [UserPlayerAclController],
  providers: [UserPlayerAclService],
})
export class UserPlayerAclModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'user-player-acl', method: RequestMethod.GET });
  }
}
