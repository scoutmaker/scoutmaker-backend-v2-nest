import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

const include = Prisma.validator<Prisma.LikeNoteInclude>()({
  note: true,
  user: true,
});

@Injectable()
export class LikeNotesService {
  constructor(private readonly prisma: PrismaService) {}

  like(noteId: number, userId: number) {
    return this.prisma.likeNote.create({
      data: {
        note: { connect: { id: noteId } },
        user: { connect: { id: userId } },
      },
      include,
    });
  }

  unlike(noteId: number, userId: number) {
    return this.prisma.likeNote.delete({
      where: {
        noteId_userId: { noteId, userId },
      },
      include,
    });
  }
}
