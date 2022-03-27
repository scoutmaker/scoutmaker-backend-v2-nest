import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserPlayerAceDto } from './dto/create-user-player-ace.dto';
import { FindAllUserPlayerAceDto } from './dto/find-all-user-player-ace.dto';
import { UpdateUserPlayerAceDto } from './dto/update-user-player-ace.dto';
import { UserPlayerAcePaginationOptionsDto } from './dto/user-player-ace-pagination-options.dto';

const include = Prisma.validator<Prisma.UserPlayerAccessControlEntryInclude>()({
  user: true,
  player: true,
});

@Injectable()
export class UserPlayerAclService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAceDto: CreateUserPlayerAceDto) {
    return this.prisma.userPlayerAccessControlEntry.create({
      data: createAceDto,
      include,
    });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: UserPlayerAcePaginationOptionsDto,
    { playerId, userId }: FindAllUserPlayerAceDto,
  ) {
    let sort: Prisma.UserPlayerAccessControlEntryOrderByWithRelationInput;

    switch (sortBy) {
      case 'user':
      case 'player':
        sort = { [sortBy]: { lastName: sortingOrder } };
        break;
      default:
        sort = { [sortBy]: sortingOrder };
        break;
    }

    const where: Prisma.UserPlayerAccessControlEntryWhereInput = {
      playerId,
      userId,
    };

    const accessControlEntries =
      await this.prisma.userPlayerAccessControlEntry.findMany({
        where,
        take: limit,
        skip: calculateSkip(page, limit),
        orderBy: sort,
        include,
      });

    const total = await this.prisma.userPlayerAccessControlEntry.count({
      where,
    });

    return formatPaginatedResponse({
      docs: accessControlEntries,
      totalDocs: total,
      limit,
      page,
    });
  }

  findOne(id: string) {
    return this.prisma.userPlayerAccessControlEntry.findUnique({
      where: { id },
      include,
    });
  }

  update(id: string, updateAceDto: UpdateUserPlayerAceDto) {
    return this.prisma.userPlayerAccessControlEntry.update({
      where: { id },
      data: updateAceDto,
      include,
    });
  }

  remove(id: string) {
    return this.prisma.userPlayerAccessControlEntry.delete({
      where: { id },
      include,
    });
  }
}
