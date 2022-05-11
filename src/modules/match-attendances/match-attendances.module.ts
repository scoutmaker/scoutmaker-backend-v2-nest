import { Module } from '@nestjs/common';
import { MatchAttendancesService } from './match-attendances.service';
import { MatchAttendancesController } from './match-attendances.controller';

@Module({
  controllers: [MatchAttendancesController],
  providers: [MatchAttendancesService]
})
export class MatchAttendancesModule {}
