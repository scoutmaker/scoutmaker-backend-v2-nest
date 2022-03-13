import { Injectable } from '@nestjs/common';

@Injectable()
export class FollowPlayersService {
  create() {
    return 'This action adds a new followPlayer';
  }

  remove(id: number) {
    return `This action removes a #${id} followPlayer`;
  }
}
