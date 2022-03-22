import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerPositionDto } from './dto/create-player-position.dto';
import { UpdatePlayerPositionDto } from './dto/update-player-position.dto';

@Injectable()
export class PlayerPositionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPlayerPositionDto: CreatePlayerPositionDto) {
    return this.prisma.playerPosition.create({ data: createPlayerPositionDto });
  }

  findAll() {
    return this.prisma.playerPosition.findMany();
  }

  findOne(id: string) {
    return this.prisma.playerPosition.findUnique({ where: { id } });
  }

  update(id: string, updatePlayerPositionDto: UpdatePlayerPositionDto) {
    return this.prisma.playerPosition.update({
      where: { id },
      data: updatePlayerPositionDto,
    });
  }

  remove(id: string) {
    return this.prisma.playerPosition.delete({ where: { id } });
  }
}
