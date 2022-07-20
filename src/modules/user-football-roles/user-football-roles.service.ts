import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserFootballRoleDto } from './dto/create-user-football-role.dto';
import { UpdateUserFootballRoleDto } from './dto/update-user-football-role.dto';

@Injectable()
export class UserFootballRolesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserFootballRoleDto: CreateUserFootballRoleDto) {
    return this.prisma.userFootballRole.create({
      data: createUserFootballRoleDto,
    });
  }

  findAll() {
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
