import { Injectable } from '@nestjs/common';
import { Prisma, User, UserRole } from '@prisma/client';

import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import {
  calculateSkip,
  formatPaginatedResponse,
  isIdsArrayFilterDefined,
} from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersPaginationOptionsDto } from './dto/users-pagination-options.dto';
import { AccountStatusEnum, UserRoleEnum } from './types';

const include: Prisma.UserInclude = {
  region: { include: { country: true } },
  footballRole: true,
  club: true,
  profile: true,
  _count: {
    select: {
      createdReports: true,
      createdNotes: true,
      createdInsiderNotes: true,
    },
  },
};

interface CsvInput {
  id: number | string;
  role: string;
  status: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  activeRadius: number;
  scoutmakerv1Id?: string;
  regionId?: number | string;
  footballRoleId?: number | string;
  clubId?: number | string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { footballRoleId, regionId, ...rest } = createUserDto;

    return this.prisma.user.create({
      data: {
        ...rest,
        profile: { create: {} },
        region: regionId ? { connect: { id: regionId } } : undefined,
        footballRole: footballRoleId
          ? { connect: { id: footballRoleId } }
          : undefined,
      },
    });
  }

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreateUserDto();
      instance.id = item.id?.toString();
      instance.role =
        item.role === 'playmaker-scout'
          ? UserRoleEnum.PLAYMAKER_SCOUT
          : (item.role?.toUpperCase() as UserRoleEnum);
      instance.status = item.status?.toUpperCase() as AccountStatusEnum;
      instance.email = item.email;
      instance.firstName = item.firstName;
      instance.lastName = item.lastName;
      instance.phone = item.phone?.toString();
      instance.city = item.city;
      instance.password = `${item.lastName.toLowerCase()}@scoutmaker2022`;
      instance.activeRadius = item.activeRadius;
      instance.scoutmakerv1Id = item.scoutmakerv1Id;
      instance.regionId = item.regionId?.toString();
      instance.footballRoleId = item.footballRoleId?.toString();

      return instance;
    });

    await validateInstances(instances);

    const createdDocuments: User[] = [];
    const errors: any[] = [];

    for (const [index, instance] of instances.entries()) {
      try {
        const created = await this.create(instance);
        createdDocuments.push(created);
      } catch (error) {
        errors.push({
          index,
          name: `${instance.firstName}  ${instance.lastName}`,
          error,
        });
      }
    }

    return { createdDocuments, errors };
  }

  generateWhereClause({
    name,
    roles,
    clubIds,
    footballRoleIds,
    regionIds,
    hasScoutProfile,
  }: FindAllUsersDto): Prisma.UserWhereInput {
    return {
      OR: name
        ? [
            { firstName: { contains: name, mode: 'insensitive' } },
            { lastName: { contains: name, mode: 'insensitive' } },
          ]
        : undefined,
      role: isIdsArrayFilterDefined(roles) ? { in: roles } : undefined,
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
      profile: hasScoutProfile ? { isNot: null } : undefined,
    };
  }

  async findAllWithPagination(
    { limit, page, sortBy, sortingOrder }: UsersPaginationOptionsDto,
    query: FindAllUsersDto,
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

    const where = this.generateWhereClause(query);

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

  getList(query?: FindAllUsersDto) {
    let where = undefined;

    if (query) where = this.generateWhereClause(query);

    return this.prisma.user.findMany({ where });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { ...include, reportBackgroundImage: true },
    });
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

  getCount(filters: Prisma.UserWhereInput) {
    return this.prisma.user.count({ where: filters });
  }
}
