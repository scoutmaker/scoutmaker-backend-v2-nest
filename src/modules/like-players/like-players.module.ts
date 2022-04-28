import { Module } from '@nestjs/common';
import { LikePlayersService } from './like-players.service';
import { LikePlayersController } from './like-players.controller';

@Module({
  controllers: [LikePlayersController],
  providers: [LikePlayersService]
})
export class LikePlayersModule {}
