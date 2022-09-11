import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';

import {
  calculateSkip,
  formatPaginatedResponse,
  isIdsArrayFilterDefined,
} from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersPaginationOptionsDto } from './dto/users-pagination-options.dto';

const include: Prisma.UserInclude = {
  region: { include: { country: true } },
  footballRole: true,
  club: true,
  _count: {
    select: {
      createdReports: true,
      createdNotes: true,
      createdInsiderNotes: true,
    },
  },
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllWithPagination(
    { limit, page, sortBy, sortingOrder }: UsersPaginationOptionsDto,
    { name, role, clubIds, footballRoleIds, regionIds }: FindAllUsersDto,
  ) {
    let sort: Prisma.UserOrderByWithRelationInput;

    switch (sortBy) {
      case 'club':
      case 'region':
      case 'footballRole':
        sort = { [sortBy]: { name: sortingOrder } };
        break;

      case 'reportsCount':
        sort = { createdReports: { _count: sortingOrder } };
        break;

      case 'notesCount':
        sort = { createdNotes: { _count: sortingOrder } };
        break;

      case 'insiderNotesCount':
        sort = { createdInsiderNotes: { _count: sortingOrder } };
        break;

      default:
        sort = { [sortBy]: sortingOrder };
        break;
    }

    const where: Prisma.UserWhereInput = {
      OR: name
        ? [
            { firstName: { contains: name, mode: 'insensitive' } },
            { lastName: { contains: name, mode: 'insensitive' } },
          ]
        : undefined,
      role,
      region: isIdsArrayFilterDefined(regionIds)
        ? {
            id: { in: regionIds },
          }
        : undefined,
      club: isIdsArrayFilterDefined(clubIds)
        ? {
            id: { in: clubIds },
          }
        : undefined,
      footballRole: isIdsArrayFilterDefined(footballRoleIds)
        ? {
            id: { in: footballRoleIds },
          }
        : undefined,
    };

    const users = await this.prisma.user.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include,
    });

    const total = await this.prisma.user.count({ where });

    return formatPaginatedResponse({
      docs: users,
      totalDocs: total,
      limit,
      page,
    });
  }

  findAll() {
    return this.prisma.user.findMany({ include });
  }

  getList() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id }, include });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findByResetPasswordToken(token: string) {
    return this.prisma.user.findUnique({
      where: { resetPasswordToken: token },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include,
    });
  }

  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        password: updatePasswordDto.newPassword,
      },
    });
  }

  verify(confirmationCode: string) {
    return this.prisma.user.update({
      where: { confirmationCode },
      data: {
        status: 'ACTIVE',
        confirmationCode: null,
        confirmationCodeExpiryDate: null,
      },
    });
  }

  changeRole(id: string, role: UserRole) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }
}
