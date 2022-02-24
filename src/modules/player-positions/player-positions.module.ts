import { Module } from '@nestjs/common';
import { PlayerPositionsService } from './player-positions.service';
import { PlayerPositionsController } from './player-positions.controller';

@Module({
  controllers: [PlayerPositionsController],
  providers: [PlayerPositionsService]
})
export class PlayerPositionsModule {}
