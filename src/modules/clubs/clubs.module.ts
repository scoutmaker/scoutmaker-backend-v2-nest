import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { featureServiceName } from '../../common/guards/admin-or-author.guard';
import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { ClubsController } from './clubs.controller';
import { ClubsService } from './clubs.service';

@Module({
  controllers: [ClubsController],
  providers: [
    ClubsService,
    { provide: featureServiceName, useExisting: ClubsService },
  ],
})
export class ClubsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'clubs', method: RequestMethod.GET });
  }
}
