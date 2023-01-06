import { Injectable } from '@nestjs/common';
import { PlayerPositionType, Prisma } from '@prisma/client';

import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerPositionTypeDto } from './dto/create-player-position-type.dto';
import { FindAllPlayerPositionTypesDto } from './dto/find-all-player-position-types.dto';
import { PlayerPositionTypesPaginationOptionsDto } from './dto/player-position-types-pagination-options.dto';
import { UpdatePlayerPositionTypeDto } from './dto/update-player-position-type.dto';

interface CsvInput {
  id: number;
  name: string;
  code: string;
}

@Injectable()
export class PlayerPositionTypesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPlayerPositionTypeDto: CreatePlayerPositionTypeDto) {
    return this.prisma.playerPositionType.create({
      data: createPlayerPositionTypeDto,
    });
  }

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreatePlayerPositionTypeDto();

      instance.id = item.id?.toString();
      instance.name = item.name;
      instance.code = item.code;

      return instance;
    });

    await validateInstances(instances);

    const createdDocuments: PlayerPositionType[] = [];
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
    {
      limit,
      page,
      sortBy,
      sortingOrder,
    }: PlayerPositionTypesPaginationOptionsDto,
    { name, code }: FindAllPlayerPositionTypesDto,
  ) {
    const where: Prisma.PlayerPositionWhereInput = {
      name: { contains: name, mode: 'insensitive' },
      code: { contains: code, mode: 'insensitive' },
    };

    const playerPositionTypes = await this.prisma.playerPositionType.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: { [sortBy]: sortingOrder },
    });

    const total = await this.prisma.playerPositionType.count({ where });

    return formatPaginatedResponse({
      docs: playerPositionTypes,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.playerPositionType.findMany();
  }

  findOne(id: string) {
    return this.prisma.playerPositionType.findUnique({ where: { id } });
  }

  update(id: string, updatePlayerPositionTypeDto: UpdatePlayerPositionTypeDto) {
    return this.prisma.playerPositionType.update({
      where: { id },
      data: updatePlayerPositionTypeDto,
    });
  }

  remove(id: string) {
    return this.prisma.playerPositionType.delete({ where: { id } });
  }
}
