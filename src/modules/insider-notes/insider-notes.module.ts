import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../middleware/prepare-query.middleware';
import { InsiderNotesController } from './insider-notes.controller';
import { InsiderNotesService } from './insider-notes.service';

@Module({
  controllers: [InsiderNotesController],
  providers: [InsiderNotesService],
})
export class InsiderNotesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'insider-notes', method: RequestMethod.GET });
  }
}
