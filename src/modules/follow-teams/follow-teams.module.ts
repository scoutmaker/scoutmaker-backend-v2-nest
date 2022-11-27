import { Module } from '@nestjs/common';

import { FollowTeamsController } from './follow-teams.controller';
import { FollowTeamsService } from './follow-teams.service';

@Module({
  controllers: [FollowTeamsController],
  providers: [FollowTeamsService],
})
export class FollowTeamsModule {}
