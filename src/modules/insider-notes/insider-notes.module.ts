import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../middleware/prepare-query.middleware';
import { PlayersModule } from '../players/players.module';
import { InsiderNotesController } from './insider-notes.controller';
import { InsiderNotesService } from './insider-notes.service';

@Module({
  controllers: [InsiderNotesController],
  providers: [InsiderNotesService],
  imports: [PlayersModule],
})
export class InsiderNotesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'insider-notes', method: RequestMethod.GET });
  }
}
