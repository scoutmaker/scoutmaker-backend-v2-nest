import { Module } from '@nestjs/common';
import { FollowTeamsService } from './follow-teams.service';
import { FollowTeamsController } from './follow-teams.controller';

@Module({
  controllers: [FollowTeamsController],
  providers: [FollowTeamsService]
})
export class FollowTeamsModule {}
