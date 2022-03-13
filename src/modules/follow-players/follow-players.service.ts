import { Injectable } from '@nestjs/common';
import { CreateFollowPlayerDto } from './dto/create-follow-player.dto';
import { UpdateFollowPlayerDto } from './dto/update-follow-player.dto';

@Injectable()
export class FollowPlayersService {
  create(createFollowPlayerDto: CreateFollowPlayerDto) {
    return 'This action adds a new followPlayer';
  }

  findAll() {
    return `This action returns all followPlayers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} followPlayer`;
  }

  update(id: number, updateFollowPlayerDto: UpdateFollowPlayerDto) {
    return `This action updates a #${id} followPlayer`;
  }

  remove(id: number) {
    return `This action removes a #${id} followPlayer`;
  }
}
