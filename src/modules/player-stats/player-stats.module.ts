import { Module } from '@nestjs/common';
import { PlayerStatsService } from './player-stats.service';
import { PlayerStatsController } from './player-stats.controller';

@Module({
  controllers: [PlayerStatsController],
  providers: [PlayerStatsService]
})
export class PlayerStatsModule {}
