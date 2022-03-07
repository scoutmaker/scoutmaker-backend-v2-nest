import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInsiderNoteDto } from './dto/create-insider-note.dto';
import { FindAllInsiderNotesDto } from './dto/find-all-insider-notes.dto';
import { InsiderNotesPaginationOptionsDto } from './dto/insider-notes-pagination-options.dto';
import { UpdateInsiderNoteDto } from './dto/update-insider-note.dto';

const include: Prisma.InsiderNoteInclude = {
  player: true,
  author: true,
};

@Injectable()
export class InsiderNotesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createInsiderNoteDto: CreateInsiderNoteDto, authorId: string) {
    const { playerId, ...rest } = createInsiderNoteDto;

    return this.prisma.insiderNote.create({
      data: {
        ...rest,
        player: { connect: { id: playerId } },
        author: { connect: { id: authorId } },
      },
      include,
    });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: InsiderNotesPaginationOptionsDto,
    { playerId }: FindAllInsiderNotesDto,
  ) {
    let sort: Prisma.InsiderNoteOrderByWithRelationInput;

    switch (sortBy) {
      case 'player':
        sort = { [sortBy]: { lastName: sortingOrder } };
        break;
      default:
        sort = { [sortBy]: sortingOrder };
        break;
    }

    const where: Prisma.InsiderNoteWhereInput = {
      playerId,
    };

    const insiderNotes = await this.prisma.insiderNote.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include,
    });

    const total = await this.prisma.insiderNote.count({ where });

    return formatPaginatedResponse({
      docs: insiderNotes,
      totalDocs: total,
      limit,
      page,
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} insiderNote`;
  }

  update(id: string, updateInsiderNoteDto: UpdateInsiderNoteDto) {
    return `This action updates a #${id} insiderNote`;
  }

  remove(id: string) {
    return `This action removes a #${id} insiderNote`;
  }
}
