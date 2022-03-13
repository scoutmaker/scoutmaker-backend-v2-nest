import { Module } from '@nestjs/common';

import { FollowAgenciesController } from './follow-agencies.controller';
import { FollowAgenciesService } from './follow-agencies.service';

@Module({
  controllers: [FollowAgenciesController],
  providers: [FollowAgenciesService],
})
export class FollowAgenciesModule {}
