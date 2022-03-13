import { Injectable } from '@nestjs/common';

import { CreateFollowScoutDto } from './dto/create-follow-scout.dto';

@Injectable()
export class FollowScoutsService {
  create(createFollowScoutDto: CreateFollowScoutDto) {
    return 'This action adds a new followScout';
  }

  remove(id: number) {
    return `This action removes a #${id} followScout`;
  }
}
