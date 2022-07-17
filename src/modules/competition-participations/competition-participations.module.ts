import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { CompetitionParticipationsController } from './competition-participations.controller';
import { CompetitionParticipationsService } from './competition-participations.service';

@Module({
  controllers: [CompetitionParticipationsController],
  providers: [CompetitionParticipationsService],
})
export class CompetitionParticipationsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'competition-participations',
      method: RequestMethod.GET,
    });
  }
}
