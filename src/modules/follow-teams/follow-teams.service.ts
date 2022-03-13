import { Injectable } from '@nestjs/common';

import { CreateFollowTeamDto } from './dto/create-follow-team.dto';

@Injectable()
export class FollowTeamsService {
  create(createFollowTeamDto: CreateFollowTeamDto) {
    return 'This action adds a new followTeam';
  }

  remove(id: number) {
    return `This action removes a #${id} followTeam`;
  }
}
