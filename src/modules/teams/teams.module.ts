import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { PrepareQueryMiddleware } from '../../middleware/prepare-query.middleware';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'clubs', method: RequestMethod.GET });
  }
}
