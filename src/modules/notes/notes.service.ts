import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculatePercentageRating } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

const include: Prisma.NoteInclude = {
  player: true,
  match: { include: { homeTeam: true, awayTeam: true } },
  positionPlayed: true,
  author: true,
};

const { match, positionPlayed, author, ...listInclude } = include;

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createNoteDto: CreateNoteDto, authorId: string) {
    const {
      playerId,
      matchId,
      positionPlayedId,
      rating,
      maxRatingScore,
      ...rest
    } = createNoteDto;

    let percentageRating: number;

    if (rating && maxRatingScore) {
      percentageRating = calculatePercentageRating(rating, maxRatingScore);
    }

    return this.prisma.note.create({
      data: {
        ...rest,
        rating,
        maxRatingScore,
        percentageRating: percentageRating || null,
        player: playerId ? { connect: { id: playerId } } : undefined,
        match: matchId ? { connect: { id: matchId } } : undefined,
        positionPlayed: positionPlayedId
          ? { connect: { id: positionPlayedId } }
          : undefined,
        author: { connect: { id: authorId } },
      },
      include,
    });
  }

  findAll() {
    return `This action returns all notes`;
  }

  findOne(id: string) {
    return `This action returns a #${id} note`;
  }

  update(id: string, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  remove(id: string) {
    return `This action removes a #${id} note`;
  }
}
