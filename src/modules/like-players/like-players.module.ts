import { Module } from '@nestjs/common';

import { LikePlayersController } from './like-players.controller';
import { LikePlayersService } from './like-players.service';

@Module({
  controllers: [LikePlayersController],
  providers: [LikePlayersService],
})
export class LikePlayersModule {}
