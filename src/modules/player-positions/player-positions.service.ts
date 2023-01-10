import { Injectable } from '@nestjs/common';
import { PlayerPosition, Prisma } from '@prisma/client';

import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerPositionDto } from './dto/create-player-position.dto';
import { FindAllPlayerPositionsDto } from './dto/find-all-player-positions.dto';
import { PlayerPositionsPaginationOptionsDto } from './dto/player-positions-pagination-options.dto';
import { UpdatePlayerPositionDto } from './dto/update-player-position.dto';

const include: Prisma.PlayerPositionInclude = {
  positionType: true,
};

interface CsvInput {
  id: number;
  name: string;
  code: string;
}

@Injectable()
export class PlayerPositionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPlayerPositionDto: CreatePlayerPositionDto) {
    return this.prisma.playerPosition.create({
      data: createPlayerPositionDto,
      include,
    });
  }

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreatePlayerPositionDto();

      instance.id = item.id?.toString();
      instance.name = item.name;
      instance.code = item.code;

      return instance;
    });

    await validateInstances(instances);

    const createdDocuments: PlayerPosition[] = [];
    const errors: any[] = [];

    for (const [index, instance] of instances.entries()) {
      try {
        const created = await this.create(instance);
        createdDocuments.push(created);
      } catch (error) {
        errors.push({ index, name: instance.name, error });
      }
    }

    return {
      csvRowsCount: result.data.length,
      createdCount: createdDocuments.length,
      errors,
    };
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
      include,
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
    return this.prisma.playerPosition.findMany({ include });
  }

  findOne(id: string) {
    return this.prisma.playerPosition.findUnique({ where: { id }, include });
  }

  update(id: string, updatePlayerPositionDto: UpdatePlayerPositionDto) {
    return this.prisma.playerPosition.update({
      where: { id },
      data: updatePlayerPositionDto,
      include,
    });
  }

  remove(id: string) {
    return this.prisma.playerPosition.delete({ where: { id }, include });
  }
}
