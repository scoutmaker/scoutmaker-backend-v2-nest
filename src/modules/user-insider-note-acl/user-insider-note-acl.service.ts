import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInsiderNoteAceDto } from './dto/create-user-insider-note-ace.dto';
import { FindAllUserInsiderNoteAceDto } from './dto/find-all-user-insider-note-ace.dto';
import { UpdateUserInsiderNoteAceDto } from './dto/update-user-insider-note-ace.dto';
import { UserInsiderNoteAcePaginationOptionsDto } from './dto/user-insider-note-ace-pagination-options.dto';

const include =
  Prisma.validator<Prisma.UserInsiderNoteAccessControlEntryInclude>()({
    user: true,
    insiderNote: true,
  });

@Injectable()
export class UserInsiderNoteAclService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAceDto: CreateUserInsiderNoteAceDto) {
    return this.prisma.userInsiderNoteAccessControlEntry.create({
      data: createAceDto,
      include,
    });
  }

  async findAll(
    {
      limit,
      page,
      sortBy,
      sortingOrder,
    }: UserInsiderNoteAcePaginationOptionsDto,
    { insiderNoteId, userId }: FindAllUserInsiderNoteAceDto,
  ) {
    let sort: Prisma.UserInsiderNoteAccessControlEntryOrderByWithRelationInput;

    switch (sortBy) {
      case 'user':
        sort = { user: { lastName: sortingOrder } };
        break;
      case 'insiderNote':
        sort = { insiderNote: { createdAt: sortingOrder } };
        break;
      default:
        sort = { [sortBy]: sortingOrder };
        break;
    }

    const where: Prisma.UserInsiderNoteAccessControlEntryWhereInput = {
      insiderNoteId,
      userId,
    };

    const accessControlEntries =
      await this.prisma.userInsiderNoteAccessControlEntry.findMany({
        where,
        take: limit,
        skip: calculateSkip(page, limit),
        orderBy: sort,
        include,
      });

    const total = await this.prisma.userInsiderNoteAccessControlEntry.count({
      where,
    });

    return formatPaginatedResponse({
      docs: accessControlEntries,
      totalDocs: total,
      limit,
      page,
    });
  }

  findOne(id: number) {
    return this.prisma.userInsiderNoteAccessControlEntry.findUnique({
      where: { id },
      include,
    });
  }

  findOneByUserAndInsiderNoteId(userId: number, insiderNoteId: number) {
    return this.prisma.userInsiderNoteAccessControlEntry.findUnique({
      where: { userId_insiderNoteId: { insiderNoteId, userId } },
    });
  }

  findOneByUserAndPlayerId(userId: number, playerId: number) {
    return this.prisma.userInsiderNoteAccessControlEntry.findFirst({
      where: {
        user: { id: userId },
        insiderNote: { player: { id: playerId } },
      },
    });
  }

  update(id: number, updateAceDto: UpdateUserInsiderNoteAceDto) {
    return this.prisma.userInsiderNoteAccessControlEntry.update({
      where: { id },
      data: updateAceDto,
      include,
    });
  }

  remove(id: number) {
    return this.prisma.userInsiderNoteAccessControlEntry.delete({
      where: { id },
      include,
    });
  }
}
