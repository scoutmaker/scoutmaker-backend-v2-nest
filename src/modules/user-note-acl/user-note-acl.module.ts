import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../middleware/prepare-query.middleware';
import { UserNoteAclController } from './user-note-acl.controller';
import { UserNoteAclService } from './user-note-acl.service';

@Module({
  controllers: [UserNoteAclController],
  providers: [UserNoteAclService],
})
export class UserNoteAclModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'user-note-acl', method: RequestMethod.GET });
  }
}
