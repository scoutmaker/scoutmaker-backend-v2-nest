import { Module } from '@nestjs/common';
import { CompetitionGroupsService } from './competition-groups.service';
import { CompetitionGroupsController } from './competition-groups.controller';

@Module({
  controllers: [CompetitionGroupsController],
  providers: [CompetitionGroupsService],
})
export class CompetitionGroupsModule {}
