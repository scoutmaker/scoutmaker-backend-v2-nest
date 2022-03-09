import { Injectable } from '@nestjs/common';
import { Note, Prisma } from '@prisma/client';

import {
  calculatePercentageRating,
  calculateSkip,
  formatPaginatedResponse,
} from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { FindAllNotesDto, GetNotesListDto } from './dto/find-all-notes.dto';
import { NotesPaginationOptionsDto } from './dto/notes-pagination-options.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

const include: Prisma.NoteInclude = {
  player: { include: { country: true, primaryPosition: true } },
  match: { include: { homeTeam: true, awayTeam: true, competition: true } },
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

  async findAll(
    { limit, page, sortBy, sortingOrder }: NotesPaginationOptionsDto,
    {
      playerId,
      positionId,
      teamId,
      matchId,
      percentageRatingRangeStart,
      percentageRatingRangeEnd,
    }: FindAllNotesDto,
  ) {
    let sort: Prisma.NoteOrderByWithRelationInput;

    switch (sortBy) {
      case 'percentageRating':
      case 'createdAt':
        sort = { [sortBy]: sortingOrder };
        break;
      case 'match':
        sort = { match: { date: sortingOrder } };
        break;
      case 'player':
      case 'author':
        sort = { [sortBy]: { lastName: sortingOrder } };
        break;
      case 'positionPlayed':
        sort = { positionPlayed: { name: sortingOrder } };
        break;
      default:
        sort = undefined;
        break;
    }

    const where: Prisma.NoteWhereInput = {
      player: { id: playerId },
      match: { id: matchId },
      percentageRating: {
        gte: percentageRatingRangeStart,
        lte: percentageRatingRangeEnd,
      },
      AND: [
        {
          OR: [
            { positionPlayed: { id: positionId } },
            { player: { primaryPosition: { id: positionId } } },
          ],
        },
        {
          OR: [
            { match: { homeTeam: { id: teamId } } },
            { match: { awayTeam: { id: teamId } } },
          ],
        },
      ],
    };

    const notes = await this.prisma.note.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include,
    });

    const total = await this.prisma.note.count({ where });

    return formatPaginatedResponse({
      docs: notes,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList({ matchId }: GetNotesListDto) {
    return this.prisma.note.findMany({
      where: { match: { id: matchId } },
      include: listInclude,
    });
  }

  findOne(id: string) {
    return this.prisma.note.findUnique({ where: { id }, include });
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    const { rating, maxRatingScore } = updateNoteDto;

    let percentageRating: number;
    let note: Note;

    if (rating && maxRatingScore) {
      percentageRating = calculatePercentageRating(rating, maxRatingScore);
    }

    if ((!rating && maxRatingScore) || (rating && !maxRatingScore)) {
      note = await this.prisma.note.findUnique({ where: { id } });
      const newRating = rating || note.rating;
      const newMaxRatingScore = maxRatingScore || note.maxRatingScore;
      if (newRating && newMaxRatingScore) {
        percentageRating = calculatePercentageRating(
          newRating,
          newMaxRatingScore,
        );
      }
    }

    return this.prisma.note.update({
      where: { id },
      data: {
        ...updateNoteDto,
        percentageRating: percentageRating || undefined,
      },
      include,
    });
  }

  remove(id: string) {
    return this.prisma.note.delete({ where: { id }, include });
  }
}
