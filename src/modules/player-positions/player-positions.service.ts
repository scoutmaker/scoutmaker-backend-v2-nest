import { Injectable } from '@nestjs/common';
import { CreatePlayerPositionDto } from './dto/create-player-position.dto';
import { UpdatePlayerPositionDto } from './dto/update-player-position.dto';

@Injectable()
export class PlayerPositionsService {
  create(createPlayerPositionDto: CreatePlayerPositionDto) {
    return 'This action adds a new playerPosition';
  }

  findAll() {
    return `This action returns all playerPositions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} playerPosition`;
  }

  update(id: number, updatePlayerPositionDto: UpdatePlayerPositionDto) {
    return `This action updates a #${id} playerPosition`;
  }

  remove(id: number) {
    return `This action removes a #${id} playerPosition`;
  }
}
