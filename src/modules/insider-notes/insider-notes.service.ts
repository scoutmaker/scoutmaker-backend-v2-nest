import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateInsiderNoteDto } from './dto/create-insider-note.dto';
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

  findAll() {
    return `This action returns all insiderNotes`;
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
