import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import Redis from 'ioredis';

import { REDIS_TTL } from '../../common/constants/redis';
import {
  calculatePercentageRating,
  calculateSkip,
  formatPaginatedResponse,
} from '../../utils/helpers';
import { PlayersService } from '../players/players.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { FindAllNotesDto, GetNotesListDto } from './dto/find-all-notes.dto';
import { NotesPaginationOptionsDto } from './dto/notes-pagination-options.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

const include: Prisma.NoteInclude = {
  player: { include: { country: true, primaryPosition: true } },
  match: { include: { homeTeam: true, awayTeam: true, competition: true } },
  author: true,
};

const { match, author, ...listInclude } = include;

@Injectable()
export class NotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly playersService: PlayersService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async create(createNoteDto: CreateNoteDto, authorId: string) {
    const {
      playerId,
      matchId,
      positionPlayedId,
      teamId,
      competitionId,
      competitionGroupId,
      rating,
      maxRatingScore,
      ...rest
    } = createNoteDto;

    let percentageRating: number;

    if (rating && maxRatingScore) {
      percentageRating = calculatePercentageRating(rating, maxRatingScore);
    }

    let metaPositionId: string;
    let metaTeamId: string;
    let metaCompetitionId: string;
    let metaCompetitionGroupId: string | undefined;

    // If there's playerId supplied, we need to create note meta
    if (playerId) {
      const player = await this.playersService.findOneWithCurrentTeamDetails(
        playerId,
      );

      metaPositionId = positionPlayedId || player.primaryPositionId;
      metaTeamId = teamId || player.teams[0].teamId;
      metaCompetitionId =
        competitionId || player.teams[0].team.competitions[0].competitionId;
      metaCompetitionGroupId =
        competitionGroupId || player.teams[0].team.competitions[0].groupId;
    }

    return this.prisma.note.create({
      data: {
        ...rest,
        rating,
        maxRatingScore,
        percentageRating: percentageRating || null,
        player: playerId ? { connect: { id: playerId } } : undefined,
        match: matchId ? { connect: { id: matchId } } : undefined,
        author: { connect: { id: authorId } },
        meta: playerId
          ? {
              create: {
                position: { connect: { id: metaPositionId } },
                team: { connect: { id: metaTeamId } },
                competition: { connect: { id: metaCompetitionId } },
                competitionGroup: metaCompetitionGroupId
                  ? { connect: { id: metaCompetitionGroupId } }
                  : undefined,
              },
            }
          : undefined,
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
        sort = { meta: { position: { name: sortingOrder } } };
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
            { meta: { position: { id: positionId } } },
            { player: { primaryPosition: { id: positionId } } },
          ],
        },
        {
          OR: [
            { match: { homeTeam: { id: teamId } } },
            { match: { awayTeam: { id: teamId } } },
            { meta: { team: { id: teamId } } },
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

  async findOne(id: string) {
    const redisKey = `note:${id}`;

    const cached = await this.redis.get(redisKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const note = await this.prisma.note.findUnique({ where: { id }, include });

    await this.redis.set(redisKey, JSON.stringify(note), 'EX', REDIS_TTL);
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    const {
      rating,
      maxRatingScore,
      playerId,
      positionPlayedId,
      teamId,
      competitionId,
      competitionGroupId,
      ...rest
    } = updateNoteDto;

    let percentageRating: number;
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: { meta: true },
    });

    if (rating && maxRatingScore) {
      percentageRating = calculatePercentageRating(rating, maxRatingScore);
    }

    if ((!rating && maxRatingScore) || (rating && !maxRatingScore)) {
      const newRating = rating || note.rating;
      const newMaxRatingScore = maxRatingScore || note.maxRatingScore;
      if (newRating && newMaxRatingScore) {
        percentageRating = calculatePercentageRating(
          newRating,
          newMaxRatingScore,
        );
      }
    }

    // If the user wants to update playerId and there's no note metadata, we need to create it
    if (playerId && !note.meta) {
      const player = await this.playersService.findOneWithCurrentTeamDetails(
        playerId,
      );

      const metaCompetitionGroupId =
        competitionGroupId || player.teams[0].team.competitions[0].groupId;

      await this.prisma.noteMeta.create({
        data: {
          note: { connect: { id } },
          position: {
            connect: { id: positionPlayedId || player.primaryPositionId },
          },
          team: { connect: { id: teamId || player.teams[0].teamId } },
          competition: {
            connect: {
              id:
                competitionId ||
                player.teams[0].team.competitions[0].competitionId,
            },
          },
          competitionGroup: metaCompetitionGroupId
            ? { connect: { id: metaCompetitionGroupId } }
            : undefined,
        },
      });
    }

    // If the user wants to update note metadata, we need to update note meta record
    if (positionPlayedId || teamId || competitionId || competitionGroupId) {
      await this.prisma.noteMeta.update({
        where: { noteId: id },
        data: {
          positionId: positionPlayedId,
          teamId,
          competitionId,
          competitionGroupId,
        },
      });
    }

    return this.prisma.note.update({
      where: { id },
      data: {
        ...rest,
        playerId,
        rating,
        percentageRating: percentageRating || undefined,
      },
      include,
    });
  }

  async remove(id: string) {
    await this.prisma.noteMeta.delete({ where: { noteId: id } });
    return this.prisma.note.delete({ where: { id }, include });
  }
}
