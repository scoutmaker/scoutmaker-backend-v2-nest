import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

const include = Prisma.validator<Prisma.LikeInsiderNoteInclude>()({
  insiderNote: true,
  user: true,
});

@Injectable()
export class LikeInsiderNotesService {
  constructor(private readonly prisma: PrismaService) {}

  like(insiderNoteId: number, userId: number) {
    return this.prisma.likeInsiderNote.create({
      data: {
        insiderNote: { connect: { id: insiderNoteId } },
        user: { connect: { id: userId } },
      },
      include,
    });
  }

  unlike(insiderNoteId: number, userId: number) {
    return this.prisma.likeInsiderNote.delete({
      where: {
        insiderNoteId_userId: { insiderNoteId, userId },
      },
      include,
    });
  }
}
