import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserNoteAceDto } from './dto/create-user-note-ace.dto';
import { FindAllUserNoteAceDto } from './dto/find-all-user-note-ace.dto';
import { UpdateUserNoteAceDto } from './dto/update-user-note-ace.dto';
import { UserNoteAcePaginationOptionsDto } from './dto/user-note-ace-pagination-options.dto';

const include = Prisma.validator<Prisma.UserNoteAccessControlEntryInclude>()({
  user: true,
  note: true,
});

@Injectable()
export class UserNoteAclService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAceDto: CreateUserNoteAceDto) {
    return this.prisma.userNoteAccessControlEntry.create({
      data: createAceDto,
      include,
    });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: UserNoteAcePaginationOptionsDto,
    { noteId, userId }: FindAllUserNoteAceDto,
  ) {
    let sort: Prisma.UserNoteAccessControlEntryOrderByWithRelationInput;

    switch (sortBy) {
      case 'user':
        sort = { user: { lastName: sortingOrder } };
        break;
      case 'note':
        sort = { note: { createdAt: sortingOrder } };
        break;
      default:
        sort = { [sortBy]: sortingOrder };
        break;
    }

    const where: Prisma.UserNoteAccessControlEntryWhereInput = {
      noteId,
      userId,
    };

    const accessControlEntries =
      await this.prisma.userNoteAccessControlEntry.findMany({
        where,
        take: limit,
        skip: calculateSkip(page, limit),
        orderBy: sort,
        include,
      });

    const total = await this.prisma.userNoteAccessControlEntry.count({
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
    return this.prisma.userNoteAccessControlEntry.findUnique({
      where: { id },
      include,
    });
  }

  findOneByUserAndNoteId(userId: number, noteId: number) {
    return this.prisma.userNoteAccessControlEntry.findUnique({
      where: { userId_noteId: { userId, noteId } },
    });
  }

  findOneByUserAndPlayerId(userId: number, playerId: number) {
    return this.prisma.userNoteAccessControlEntry.findFirst({
      where: {
        user: { id: userId },
        note: { player: { id: playerId } },
      },
    });
  }

  update(id: number, updateAceDto: UpdateUserNoteAceDto) {
    return this.prisma.userNoteAccessControlEntry.update({
      where: { id },
      data: updateAceDto,
      include,
    });
  }

  remove(id: number) {
    return this.prisma.userNoteAccessControlEntry.delete({
      where: { id },
      include,
    });
  }
}
