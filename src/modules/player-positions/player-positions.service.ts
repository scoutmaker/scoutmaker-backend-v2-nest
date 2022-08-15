import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerPositionDto } from './dto/create-player-position.dto';
import { FindAllPlayerPositionsDto } from './dto/find-all-player-positions.dto';
import { PlayerPositionsPaginationOptionsDto } from './dto/player-positions-pagination-options.dto';
import { UpdatePlayerPositionDto } from './dto/update-player-position.dto';

@Injectable()
export class PlayerPositionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPlayerPositionDto: CreatePlayerPositionDto) {
    return this.prisma.playerPosition.create({ data: createPlayerPositionDto });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: PlayerPositionsPaginationOptionsDto,
    { name, code }: FindAllPlayerPositionsDto,
  ) {
    const where: Prisma.PlayerPositionWhereInput = {
      name: { contains: name, mode: 'insensitive' },
      code: { contains: code, mode: 'insensitive' },
    };

    const playerPositions = await this.prisma.playerPosition.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: { [sortBy]: sortingOrder },
    });

    const total = await this.prisma.playerPosition.count({ where });

    return formatPaginatedResponse({
      docs: playerPositions,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.playerPosition.findMany();
  }

  findOne(id: number) {
    return this.prisma.playerPosition.findUnique({ where: { id } });
  }

  update(id: number, updatePlayerPositionDto: UpdatePlayerPositionDto) {
    return this.prisma.playerPosition.update({
      where: { id },
      data: updatePlayerPositionDto,
    });
  }

  remove(id: number) {
    return this.prisma.playerPosition.delete({ where: { id } });
  }
}
