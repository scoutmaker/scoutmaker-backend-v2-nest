import { Module } from '@nestjs/common';

import { ScoutProfilesController } from './scout-profiles.controller';
import { ScoutProfilesService } from './scout-profiles.service';

@Module({
  controllers: [ScoutProfilesController],
  providers: [ScoutProfilesService],
})
export class ScoutProfilesModule {}
