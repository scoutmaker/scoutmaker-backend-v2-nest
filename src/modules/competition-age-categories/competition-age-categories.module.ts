import { Module } from '@nestjs/common';
import { CompetitionAgeCategoriesService } from './competition-age-categories.service';
import { CompetitionAgeCategoriesController } from './competition-age-categories.controller';

@Module({
  controllers: [CompetitionAgeCategoriesController],
  providers: [CompetitionAgeCategoriesService]
})
export class CompetitionAgeCategoriesModule {}
