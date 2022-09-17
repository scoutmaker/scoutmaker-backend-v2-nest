import { Injectable } from '@nestjs/common';
import { Prisma, UserFootballRole } from '@prisma/client';

import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserFootballRoleDto } from './dto/create-user-football-role.dto';
import { FindAllUserFootballRolesDto } from './dto/find-all-user-football-roles.dto';
import { UpdateUserFootballRoleDto } from './dto/update-user-football-role.dto';
import { UserFootballRolesPaginationOptionsDto } from './dto/user-football-roles-pagination-options.dto';

interface CsvInput {
  id: number;
  name: string;
}

@Injectable()
export class UserFootballRolesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserFootballRoleDto: CreateUserFootballRoleDto) {
    return this.prisma.userFootballRole.create({
      data: createUserFootballRoleDto,
    });
  }

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreateUserFootballRoleDto();
      instance.id = item.id?.toString();
      instance.name = item.name;

      return instance;
    });

    await validateInstances(instances);

    const createdDocuments: UserFootballRole[] = [];
    const errors: any[] = [];

    for (const [index, instance] of instances.entries()) {
      try {
        const created = await this.create(instance);
        createdDocuments.push(created);
      } catch (error) {
        errors.push({ index, name: instance.name, error });
      }
    }

    return { createdDocuments, errors };
  }

  async findAll(
    {
      limit,
      page,
      sortBy,
      sortingOrder,
    }: UserFootballRolesPaginationOptionsDto,
    { name }: FindAllUserFootballRolesDto,
  ) {
    const where: Prisma.UserFootballRoleWhereInput = {
      name: { contains: name, mode: 'insensitive' },
    };

    const roles = await this.prisma.userFootballRole.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: { [sortBy]: sortingOrder },
    });

    const total = await this.prisma.userFootballRole.count({ where });

    return formatPaginatedResponse({
      docs: roles,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.userFootballRole.findMany();
  }

  findOne(id: string) {
    return this.prisma.userFootballRole.findUnique({ where: { id } });
  }

  update(id: string, updateUserFootballRoleDto: UpdateUserFootballRoleDto) {
    return this.prisma.userFootballRole.update({
      where: { id },
      data: updateUserFootballRoleDto,
    });
  }

  remove(id: string) {
    return this.prisma.userFootballRole.delete({ where: { id } });
  }
}
