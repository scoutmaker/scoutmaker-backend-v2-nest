import { Injectable } from '@nestjs/common';
import { PlayerRole, Prisma } from '@prisma/client';

import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import {
  calculateSkip,
  formatPaginatedResponse,
  isIdsArrayFilterDefined,
} from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerRoleDto } from './dto/create-player-role.dto';
import { FindAllPlayerRolesDto } from './dto/find-all-player-roles.dto';
import { PlayerRolesPaginationOptionsDto } from './dto/player-roles-pagination-options.dto';
import { UpdatePlayerRoleDto } from './dto/update-player-role.dto';

const include: Prisma.PlayerRoleInclude = {
  positionType: true,
  examples: true,
};

interface CsvInput {
  id: number;
  name: string;
  positionTypeId: string;
  altName?: string;
  description?: string;
  isPublished?: boolean;
}

@Injectable()
export class PlayerRolesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPlayerRoleDto: CreatePlayerRoleDto) {
    return this.prisma.playerRole.create({
      data: createPlayerRoleDto,
      include,
    });
  }

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreatePlayerRoleDto();

      instance.id = item.id?.toString();
      instance.name = item.name;
      instance.altName = item.altName;
      instance.positionTypeId = item.positionTypeId;
      instance.description = item.description;
      instance.isPublished = item.isPublished;

      return instance;
    });

    await validateInstances(instances);

    const createdDocuments: PlayerRole[] = [];
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
    { limit, page, sortBy, sortingOrder }: PlayerRolesPaginationOptionsDto,
    { name, altName, positionTypeIds }: FindAllPlayerRolesDto,
  ) {
    const where: Prisma.PlayerRoleWhereInput = {
      name: name ? { contains: name, mode: 'insensitive' } : undefined,
      altName: name ? { contains: altName, mode: 'insensitive' } : undefined,
      positionType: isIdsArrayFilterDefined(positionTypeIds)
        ? { id: { in: positionTypeIds } }
        : undefined,
    };

    const playerRoles = await this.prisma.playerRole.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: { [sortBy]: sortingOrder },
      include,
    });

    const total = await this.prisma.playerRole.count({ where });

    return formatPaginatedResponse({
      docs: playerRoles,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.playerRole.findMany({
      where: { isPublished: true },
      include,
    });
  }

  findOne(id: string) {
    return this.prisma.playerRole.findUnique({ where: { id }, include });
  }

  update(id: string, updatePlayerRoleDto: UpdatePlayerRoleDto) {
    return this.prisma.playerRole.update({
      where: { id },
      data: updatePlayerRoleDto,
      include,
    });
  }

  remove(id: string) {
    return this.prisma.playerRole.delete({ where: { id }, include });
  }
}
