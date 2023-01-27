import {
  Global,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Global()
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'users',
      method: RequestMethod.GET,
    });
  }
}
