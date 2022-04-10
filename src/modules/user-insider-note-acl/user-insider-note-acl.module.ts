import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { UserInsiderNoteAclController } from './user-insider-note-acl.controller';
import { UserInsiderNoteAclService } from './user-insider-note-acl.service';

@Module({
  controllers: [UserInsiderNoteAclController],
  providers: [UserInsiderNoteAclService],
})
export class UserInsiderNoteAclModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'user-insider-note-acl', method: RequestMethod.GET });
  }
}
