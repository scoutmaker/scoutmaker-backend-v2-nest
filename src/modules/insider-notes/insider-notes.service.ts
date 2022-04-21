import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import {
  Competition,
  CompetitionGroup,
  InsiderNote,
  InsiderNoteMeta,
  Player,
  Prisma,
  User,
} from '@prisma/client';
import Redis from 'ioredis';

import { REDIS_TTL } from '../../common/constants/redis';
import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PlayersService } from '../players/players.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInsiderNoteDto } from './dto/create-insider-note.dto';
import { FindAllInsiderNotesDto } from './dto/find-all-insider-notes.dto';
import { InsiderNotesPaginationOptionsDto } from './dto/insider-notes-pagination-options.dto';
import { UpdateInsiderNoteDto } from './dto/update-insider-note.dto';

const include = Prisma.validator<Prisma.InsiderNoteInclude>()({
  player: true,
  author: true,
});

const singleInclude = Prisma.validator<Prisma.InsiderNoteInclude>()({
  player: true,
  author: true,
  meta: { include: { competition: true, competitionGroup: true } },
});

type SingleInsiderNoteWithInclude = InsiderNote & {
  player: Player;
  author: User;
  meta?: InsiderNoteMeta & {
    competition: Competition;
    competitionGroup: CompetitionGroup;
  };
};

@Injectable()
export class InsiderNotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly playersService: PlayersService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async create(createInsiderNoteDto: CreateInsiderNoteDto, authorId: string) {
    const { playerId, teamId, competitionId, competitionGroupId, ...rest } =
      createInsiderNoteDto;

    const player = await this.playersService.findOneWithCurrentTeamDetails(
      playerId,
    );

    const metaTeamId = teamId || player.teams[0].teamId;
    const metaCompetitionId =
      competitionId || player.teams[0].team.competitions[0].competitionId;
    const metaCompetitionGroupId =
      competitionGroupId || player.teams[0].team.competitions[0].groupId;

    return this.prisma.insiderNote.create({
      data: {
        ...rest,
        player: { connect: { id: playerId } },
        author: { connect: { id: authorId } },
        meta: {
          create: {
            team: { connect: { id: metaTeamId } },
            competition: { connect: { id: metaCompetitionId } },
            competitionGroup: metaCompetitionGroupId
              ? { connect: { id: metaCompetitionGroupId } }
              : undefined,
          },
        },
      },
      include,
    });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: InsiderNotesPaginationOptionsDto,
    { playerId }: FindAllInsiderNotesDto,
    accessFilters?: Prisma.InsiderNoteWhereInput,
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
      AND: [accessFilters, { playerId }],
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

  getList(accessFilters: Prisma.InsiderNoteWhereInput) {
    return this.prisma.insiderNote.findMany({ where: accessFilters, include });
  }

  async findOne(id: string): Promise<SingleInsiderNoteWithInclude> {
    const redisKey = `insider-note:${id}`;

    const cached = await this.redis.get(redisKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const insiderNote = await this.prisma.insiderNote.findUnique({
      where: { id },
      include: singleInclude,
    });

    await this.redis.set(
      redisKey,
      JSON.stringify(insiderNote),
      'EX',
      REDIS_TTL,
    );

    return insiderNote;
  }

  async update(id: string, updateInsiderNoteDto: UpdateInsiderNoteDto) {
    const { playerId, teamId, competitionId, competitionGroupId, ...rest } =
      updateInsiderNoteDto;

    let metaTeamId: string;
    let metaCompetitionId: string;
    let metaCompetitionGroupId: string | undefined;

    // If there's playerId in the update, we need to update the meta with calculated values
    if (playerId) {
      const player = await this.playersService.findOneWithCurrentTeamDetails(
        playerId,
      );

      metaTeamId = teamId || player.teams[0].teamId;
      metaCompetitionId =
        competitionId || player.teams[0].team.competitions[0]?.competitionId;
      metaCompetitionGroupId =
        competitionGroupId || player.teams[0].team.competitions[0]?.groupId;

      await this.prisma.insiderNoteMeta.update({
        where: { insiderNoteId: id },
        data: {
          teamId: metaTeamId,
          competitionId: metaCompetitionId,
          competitionGroupId: metaCompetitionGroupId,
        },
      });
    }

    // If there's no playerId in the update and there's meta data provided, we need to update the meta with provided values
    if (!playerId && (teamId || competitionId || competitionGroupId)) {
      await this.prisma.insiderNoteMeta.update({
        where: { insiderNoteId: id },
        data: {
          teamId,
          competitionId,
          competitionGroupId,
        },
      });
    }

    return this.prisma.insiderNote.update({
      where: { id },
      data: { ...rest, playerId },
      include,
    });
  }

  async remove(id: string) {
    await Promise.all([
      this.prisma.insiderNoteMeta.delete({ where: { insiderNoteId: id } }),
      this.prisma.userInsiderNoteAccessControlEntry.deleteMany({
        where: { insiderNoteId: id },
      }),
      this.prisma.organizationInsiderNoteAccessControlEntry.deleteMany({
        where: { insiderNoteId: id },
      }),
    ]);

    return this.prisma.insiderNote.delete({
      where: { id },
      include,
    });
  }
}
