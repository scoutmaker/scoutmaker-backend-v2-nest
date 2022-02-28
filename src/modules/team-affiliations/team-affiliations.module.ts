import { Module } from '@nestjs/common';
import { TeamAffiliationsService } from './team-affiliations.service';
import { TeamAffiliationsController } from './team-affiliations.controller';

@Module({
  controllers: [TeamAffiliationsController],
  providers: [TeamAffiliationsService]
})
export class TeamAffiliationsModule {}
