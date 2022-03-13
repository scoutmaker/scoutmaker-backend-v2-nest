import { Injectable } from '@nestjs/common';

@Injectable()
export class FollowTeamsService {
  create() {
    return 'This action adds a new followTeam';
  }

  remove(id: number) {
    return `This action removes a #${id} followTeam`;
  }
}
