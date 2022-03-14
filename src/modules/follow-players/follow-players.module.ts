import { Module } from '@nestjs/common';

import { FollowPlayersController } from './follow-players.controller';
import { FollowPlayersService } from './follow-players.service';

@Module({
  controllers: [FollowPlayersController],
  providers: [FollowPlayersService],
})
export class FollowPlayersModule {}
