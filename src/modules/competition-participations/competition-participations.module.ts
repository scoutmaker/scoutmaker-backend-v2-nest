import { Module } from '@nestjs/common';
import { CompetitionParticipationsService } from './competition-participations.service';
import { CompetitionParticipationsController } from './competition-participations.controller';

@Module({
  controllers: [CompetitionParticipationsController],
  providers: [CompetitionParticipationsService]
})
export class CompetitionParticipationsModule {}
