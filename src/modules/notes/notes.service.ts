import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Note, Prisma } from '@prisma/client';
import Redis from 'ioredis';

import { REDIS_TTL } from '../../utils/constants';
import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import {
  calculatePercentageRating,
  calculateSkip,
  formatPaginatedResponse,
  isIdsArrayFilterDefined,
} from '../../utils/helpers';
import { PlayersService } from '../players/players.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { FindAllNotesDto, GetNotesListDto } from './dto/find-all-notes.dto';
import { NotesPaginationOptionsDto } from './dto/notes-pagination-options.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

interface CsvInput {
  id: number;
  shirtNo?: number;
  description?: string;
  maxRatingScore?: number;
  rating?: number;
  playerId?: number;
  matchId?: number;
  positionPlayedId?: number;
  teamId?: number;
  competitionId?: number;
  competitionGroupId?: number;
  authorId: number;
}

const include: Prisma.NoteInclude = {
  player: { include: { country: true, primaryPosition: true } },
  match: { include: { homeTeam: true, awayTeam: true, competition: true } },
  author: true,
  meta: { include: { team: true, position: true } },
};

const singleInclude = Prisma.validator<Prisma.NoteInclude>()({
  player: { include: { country: true, primaryPosition: true } },
  match: { include: { homeTeam: true, awayTeam: true, competition: true } },
  author: true,
  meta: {
    include: {
      competition: true,
      competitionGroup: true,
      position: true,
      team: true,
    },
  },
});

const { match, author, ...listInclude } = include;

@Injectable()
export class NotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly playersService: PlayersService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  private getCacheKey(id: string) {
    return `note:${id}`;
  }

  private getOneFromCache(id: string) {
    return this.redis.get(this.getCacheKey(id));
  }

  private saveOneToCache<T extends Note>(note: T) {
    return this.redis.set(
      this.getCacheKey(note.id),
      JSON.stringify(note),
      'EX',
      REDIS_TTL,
    );
  }

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
      metaTeamId = teamId || player.teams[0]?.teamId;
      metaCompetitionId =
        competitionId || player.teams[0]?.team.competitions[0].competitionId;
      metaCompetitionGroupId =
        competitionGroupId || player.teams[0]?.team.competitions[0].groupId;
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
                team: metaTeamId ? { connect: { id: metaTeamId } } : undefined,
                competition: metaCompetitionId
                  ? { connect: { id: metaCompetitionId } }
                  : undefined,
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

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreateNoteDto();
      instance.id = item.id?.toString();
      instance.shirtNo = item.shirtNo;
      instance.description = item.description;
      instance.maxRatingScore = item.maxRatingScore;
      instance.rating = item.rating;
      instance.playerId = item.playerId?.toString();
      instance.matchId = item.matchId?.toString();
      instance.positionPlayedId = item.positionPlayedId?.toString();
      instance.teamId = item.teamId?.toString();
      instance.competitionId = item.competitionId?.toString();
      instance.competitionGroupId = item.competitionGroupId?.toString();

      return instance;
    });

    await validateInstances(instances);

    const createdDocuments: Note[] = [];
    const errors: any[] = [];

    for (const [index, instance] of instances.entries()) {
      try {
        const created = await this.create(
          instance,
          result.data[index].authorId.toString(),
        );
        createdDocuments.push(created);
      } catch (error) {
        errors.push({ index, name: instance.id, error });
      }
    }

    return {
      csvRowsCount: result.data.length,
      createdCount: createdDocuments.length,
      errors,
    };
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: NotesPaginationOptionsDto,
    {
      playerIds,
      positionIds,
      teamIds,
      matchIds,
      competitionIds,
      competitionGroupIds,
      percentageRatingRangeStart,
      percentageRatingRangeEnd,
      playerBornAfter,
      playerBornBefore,
      isLiked,
      userId: userIdFindParam,
      observationType,
    }: FindAllNotesDto,
    userId?: string,
    accessFilters?: Prisma.NoteWhereInput,
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
      AND: [
        { ...accessFilters },
        {
          player: isIdsArrayFilterDefined(playerIds)
            ? { id: { in: playerIds } }
            : undefined,
          match: isIdsArrayFilterDefined(matchIds)
            ? { id: { in: matchIds } }
            : undefined,
          percentageRating: {
            gte: percentageRatingRangeStart,
            lte: percentageRatingRangeEnd,
          },
          likes: isLiked ? { some: { userId } } : undefined,
          authorId: userIdFindParam,
          observationType,
          AND: [
            {
              meta: isIdsArrayFilterDefined(competitionIds)
                ? {
                    competition: { id: { in: competitionIds } },
                  }
                : undefined,
            },
            {
              meta: isIdsArrayFilterDefined(competitionGroupIds)
                ? {
                    competitionGroup: { id: { in: competitionGroupIds } },
                  }
                : undefined,
            },
            {
              OR: isIdsArrayFilterDefined(positionIds)
                ? [
                    { meta: { position: { id: { in: positionIds } } } },
                    {
                      player: { primaryPosition: { id: { in: positionIds } } },
                    },
                  ]
                : undefined,
            },
            {
              OR: isIdsArrayFilterDefined(teamIds)
                ? [
                    { match: { homeTeam: { id: { in: teamIds } } } },
                    { match: { awayTeam: { id: { in: teamIds } } } },
                    { meta: { team: { id: { in: teamIds } } } },
                  ]
                : undefined,
            },
            {
              player: {
                yearOfBirth: { gte: playerBornAfter, lte: playerBornBefore },
              },
            },
          ],
        },
      ],
    };

    const notes = await this.prisma.note.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include: userId
        ? {
            ...include,
            likes: {
              where: { userId },
            },
          }
        : include,
    });

    const total = await this.prisma.note.count({ where });

    return formatPaginatedResponse({
      docs: notes,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList(
    { matchIds }: GetNotesListDto,
    accessFilters?: Prisma.NoteWhereInput,
  ) {
    return this.prisma.note.findMany({
      where: {
        AND: [{ ...accessFilters }, { match: { id: { in: matchIds } } }],
      },
      include: listInclude,
    });
  }

  async findOne(id: string, userId?: string) {
    const cached = await this.getOneFromCache(id);

    if (cached) {
      return JSON.parse(cached);
    }

    const note = await this.prisma.note.findUnique({
      where: { id },
      include: userId
        ? {
            ...singleInclude,
            likes: {
              where: { userId },
            },
          }
        : singleInclude,
    });

    await this.saveOneToCache(note);

    return note;
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

      const metaTeamId = teamId || player.teams[0]?.teamId;
      const metaCompetitionId =
        competitionId || player.teams[0].team.competitions[0]?.competitionId;
      const metaCompetitionGroupId =
        competitionGroupId || player.teams[0]?.team.competitions[0].groupId;

      await this.prisma.noteMeta.create({
        data: {
          note: { connect: { id } },
          position: {
            connect: { id: positionPlayedId || player.primaryPositionId },
          },
          team: metaTeamId ? { connect: { id: metaTeamId } } : undefined,
          competition: metaCompetitionId
            ? {
                connect: {
                  id: metaCompetitionId,
                },
              }
            : undefined,
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

    const updated = await this.prisma.note.update({
      where: { id },
      data: {
        ...rest,
        playerId,
        rating,
        percentageRating: percentageRating || undefined,
      },
      include,
    });

    await this.saveOneToCache(updated);

    return updated;
  }

  async remove(id: string) {
    return this.prisma.note.delete({ where: { id }, include });
  }
}
