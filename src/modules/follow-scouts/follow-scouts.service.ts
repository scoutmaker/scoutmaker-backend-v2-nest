import { Injectable } from '@nestjs/common';

@Injectable()
export class FollowScoutsService {
  create() {
    return 'This action adds a new followScout';
  }

  remove(id: number) {
    return `This action removes a #${id} followScout`;
  }
}
