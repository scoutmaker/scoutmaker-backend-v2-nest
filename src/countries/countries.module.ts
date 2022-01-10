import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { PrepareQueryMiddleware } from '../middleware/prepare-query.middleware';

@Module({
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PrepareQueryMiddleware)
      .forRoutes({ path: 'countries', method: RequestMethod.GET });
  }
}
