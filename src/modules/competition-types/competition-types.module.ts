import { Module } from '@nestjs/common';
import { CompetitionTypesService } from './competition-types.service';
import { CompetitionTypesController } from './competition-types.controller';

@Module({
  controllers: [CompetitionTypesController],
  providers: [CompetitionTypesService]
})
export class CompetitionTypesModule {}
