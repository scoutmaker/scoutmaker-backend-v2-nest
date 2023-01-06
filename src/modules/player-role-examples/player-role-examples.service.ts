import { Injectable } from '@nestjs/common';
import { PlayerRoleExample, Prisma } from '@prisma/client';

import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import {
  calculateSkip,
  formatPaginatedResponse,
  isIdsArrayFilterDefined,
} from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerRoleExampleDto } from './dto/create-player-role-example.dto';
import { FindAllPlayerRoleExamplesDto } from './dto/find-all-player-role-examples.dto';
import { PlayerRoleExamplesPaginationOptionsDto } from './dto/player-role-examples-pagination-options.dto';
import { UpdatePlayerRoleExampleDto } from './dto/update-player-role-example.dto';

const include: Prisma.PlayerRoleExampleInclude = {
  role: true,
};

interface CsvInput {
  id: number;
  player: string;
  type: string;
  roleId: number;
}

@Injectable()
export class PlayerRoleExamplesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPlayerRoleExampleDto: CreatePlayerRoleExampleDto) {
    return this.prisma.playerRoleExample.create({
      data: createPlayerRoleExampleDto,
      include,
    });
  }

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreatePlayerRoleExampleDto();

      instance.id = item.id?.toString();
      instance.player = item.player;
      instance.type = item.type;
      instance.roleId = item.roleId?.toString();

      return instance;
    });

    await validateInstances(instances);

    const createdDocuments: PlayerRoleExample[] = [];
    const errors: any[] = [];

    for (const [index, instance] of instances.entries()) {
      try {
        const created = await this.create(instance);
        createdDocuments.push(created);
      } catch (error) {
        errors.push({ index, name: instance.player, error });
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
    }: PlayerRoleExamplesPaginationOptionsDto,
    { player, roleIds, type }: FindAllPlayerRoleExamplesDto,
  ) {
    const where: Prisma.PlayerRoleExampleWhereInput = {
      player: player ? { contains: player, mode: 'insensitive' } : undefined,
      type: type ? { contains: type, mode: 'insensitive' } : undefined,
      role: isIdsArrayFilterDefined(roleIds)
        ? { id: { in: roleIds } }
        : undefined,
    };

    const examples = await this.prisma.playerRoleExample.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: { [sortBy]: sortingOrder },
      include,
    });

    const total = await this.prisma.playerRoleExample.count({ where });

    return formatPaginatedResponse({
      docs: examples,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.playerRoleExample.findMany({
      where: { isPublished: true },
      include,
    });
  }

  findOne(id: string) {
    return this.prisma.playerRoleExample.findUnique({ where: { id }, include });
  }

  update(id: string, updatePlayerRoleExampleDto: UpdatePlayerRoleExampleDto) {
    return this.prisma.playerRoleExample.update({
      where: { id },
      data: updatePlayerRoleExampleDto,
      include,
    });
  }

  remove(id: string) {
    return this.prisma.playerRoleExample.delete({ where: { id }, include });
  }
}
