import { Injectable } from '@nestjs/common';

import { CreatePlayerStatsDto } from './dto/create-player-stats.dto';
import { UpdatePlayerStatsDto } from './dto/update-player-stats.dto';

@Injectable()
export class PlayerStatsService {
  create(createPlayerStatDto: CreatePlayerStatsDto) {
    return 'This action adds a new playerStat';
  }

  findAll() {
    return `This action returns all playerStats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} playerStat`;
  }

  update(id: number, updatePlayerStatDto: UpdatePlayerStatsDto) {
    return `This action updates a #${id} playerStat`;
  }

  remove(id: number) {
    return `This action removes a #${id} playerStat`;
  }
}
