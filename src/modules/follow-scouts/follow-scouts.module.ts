import { Module } from '@nestjs/common';

import { FollowScoutsController } from './follow-scouts.controller';
import { FollowScoutsService } from './follow-scouts.service';

@Module({
  controllers: [FollowScoutsController],
  providers: [FollowScoutsService],
})
export class FollowScoutsModule {}
