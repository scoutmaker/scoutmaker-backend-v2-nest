import { Module } from '@nestjs/common';

import { LikeTeamsController } from './like-teams.controller';
import { LikeTeamsService } from './like-teams.service';

@Module({
  controllers: [LikeTeamsController],
  providers: [LikeTeamsService],
})
export class LikeTeamsModule {}
