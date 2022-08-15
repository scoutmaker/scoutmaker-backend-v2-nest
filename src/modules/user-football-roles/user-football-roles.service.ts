import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserFootballRoleDto } from './dto/create-user-football-role.dto';
import { FindAllUserFootballRolesDto } from './dto/find-all-user-football-roles.dto';
import { UpdateUserFootballRoleDto } from './dto/update-user-football-role.dto';
import { UserFootballRolesPaginationOptionsDto } from './dto/user-football-roles-pagination-options.dto';

@Injectable()
export class UserFootballRolesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserFootballRoleDto: CreateUserFootballRoleDto) {
    return this.prisma.userFootballRole.create({
      data: createUserFootballRoleDto,
    });
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

  findOne(id: number) {
    return this.prisma.userFootballRole.findUnique({ where: { id } });
  }

  update(id: number, updateUserFootballRoleDto: UpdateUserFootballRoleDto) {
    return this.prisma.userFootballRole.update({
      where: { id },
      data: updateUserFootballRoleDto,
    });
  }

  remove(id: number) {
    return this.prisma.userFootballRole.delete({ where: { id } });
  }
}
