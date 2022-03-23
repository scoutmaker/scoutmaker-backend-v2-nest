import { Module } from '@nestjs/common';

import { PlayersModule } from '../players/players.module';
import { PlayerStatsController } from './player-stats.controller';
import { PlayerStatsService } from './player-stats.service';

@Module({
  controllers: [PlayerStatsController],
  providers: [PlayerStatsService],
  imports: [PlayersModule],
})
export class PlayerStatsModule {}
