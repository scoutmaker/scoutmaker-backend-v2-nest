import { Module } from '@nestjs/common';

import { MatchAttendancesController } from './match-attendances.controller';
import { MatchAttendancesService } from './match-attendances.service';

@Module({
  controllers: [MatchAttendancesController],
  providers: [MatchAttendancesService],
})
export class MatchAttendancesModule {}
