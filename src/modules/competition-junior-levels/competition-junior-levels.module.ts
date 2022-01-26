import { Module } from '@nestjs/common';
import { CompetitionJuniorLevelsService } from './competition-junior-levels.service';
import { CompetitionJuniorLevelsController } from './competition-junior-levels.controller';

@Module({
  controllers: [CompetitionJuniorLevelsController],
  providers: [CompetitionJuniorLevelsService]
})
export class CompetitionJuniorLevelsModule {}
