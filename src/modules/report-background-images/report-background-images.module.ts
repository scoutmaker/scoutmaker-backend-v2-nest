import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { PrepareQueryMiddleware } from '../../common/middleware/prepare-query.middleware';
import { ReportBackgroundImagesController } from './report-background-images.controller';
import { ReportBackgroundImagesService } from './report-background-images.service';

@Module({
  controllers: [ReportBackgroundImagesController],
  providers: [ReportBackgroundImagesService],
})
export class ReportBackgroundImagesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrepareQueryMiddleware).forRoutes({
      path: 'report-background-images',
      method: RequestMethod.GET,
    });
  }
}
