import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import Redis from 'ioredis';
import slugify from 'slugify';

import { REDIS_TTL } from '../../utils/constants';
import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { FindAllPlayersDto } from './dto/find-all-players.dto';
import {
  PlayersPaginationOptionsDto,
  PlayersSortByUnion,
} from './dto/players-pagination-options.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

const include: Prisma.PlayerInclude = {
  country: true,
  primaryPosition: true,
  secondaryPositions: { include: { position: true } },
  teams: {
    include: {
      team: true,
    },
  },
};

const listInclude: Prisma.PlayerInclude = {
  country: true,
  primaryPosition: true,
  teams: { where: { endDate: null }, include: { team: true } },
};

const singleInclude = Prisma.validator<Prisma.PlayerInclude>()({
  country: true,
  primaryPosition: true,
  secondaryPositions: { include: { position: true } },
  author: true,
  teams: {
    include: {
      team: {
        include: {
          competitions: {
            include: { competition: true, group: true, season: true },
          },
        },
      },
    },
  },
});

@Injectable()
export class PlayersService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async create(createPlayerDto: CreatePlayerDto, authorId: string) {
    const {
      countryId,
      primaryPositionId,
      secondaryPositionIds,
      teamId,
      ...rest
    } = createPlayerDto;

    const slug = await this.generateSlug(`${rest.lastName} ${rest.firstName}`);

    return this.prisma.player.create({
      data: {
        ...rest,
        slug,
        country: { connect: { id: countryId } },
        primaryPosition: { connect: { id: primaryPositionId } },
        secondaryPositions:
          secondaryPositionIds && secondaryPositionIds.length > 0
            ? {
                createMany: {
                  data: secondaryPositionIds.map((id) => ({
                    playerPositionId: id,
                  })),
                },
              }
            : undefined,
        teams: { create: { teamId, startDate: new Date(), endDate: null } },
        author: { connect: { id: authorId } },
      },
      include,
    });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: PlayersPaginationOptionsDto,
    query: FindAllPlayersDto,
    userId?: string,
    accessFilters?: Prisma.PlayerWhereInput,
  ) {
    let sort: Prisma.PlayerOrderByWithRelationInput;

    const regularSortBy: PlayersSortByUnion[] = [
      'firstName',
      'lastName',
      'footed',
      'height',
      'weight',
      'yearOfBirth',
    ];

    const relationSortBy: PlayersSortByUnion[] = ['country', 'primaryPosition'];

    if (regularSortBy.includes(sortBy)) {
      sort = { [sortBy]: sortingOrder };
    }

    if (relationSortBy.includes(sortBy)) {
      sort = { [sortBy]: { name: sortingOrder } };
    }

    const where: Prisma.PlayerWhereInput = {
      AND: [
        accessFilters,
        {
          yearOfBirth: { gte: query.bornAfter, lte: query.bornBefore },
          footed: query.footed,
          countryId: query.countryId,
          teams: query.teamIds
            ? { some: { teamId: { in: query.teamIds }, endDate: null } }
            : undefined,
          AND: [
            {
              OR: [
                { firstName: { contains: query.name, mode: 'insensitive' } },
                { lastName: { contains: query.name, mode: 'insensitive' } },
              ],
            },
            {
              OR: [
                { primaryPosition: { id: { in: query.positionIds } } },
                {
                  secondaryPositions: {
                    some: { playerPositionId: { in: query.positionIds } },
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const players = await this.prisma.player.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include: {
        ...include,
        likes: {
          where: { userId },
        },
      },
    });

    const total = await this.prisma.player.count({ where });

    return formatPaginatedResponse({
      docs: players,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList(accessFilters?: Prisma.PlayerWhereInput) {
    return this.prisma.player.findMany({
      where: { ...accessFilters },
      include: listInclude,
    });
  }

  async findOne(id: string, userId?: string) {
    const redisKey = `player:${id}`;

    const cached = await this.redis.get(redisKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const player = await this.prisma.player.findUnique({
      where: { id },
      include: {
        ...singleInclude,
        likes: {
          where: { userId },
        },
      },
    });

    await this.redis.set(redisKey, JSON.stringify(player), 'EX', REDIS_TTL);

    return player;
  }

  findAllBySlug(slug: string) {
    return this.prisma.player.findMany({ where: { slug } });
  }

  async generateSlug(stringToSlugify: string) {
    const baseSlug = slugify(stringToSlugify, { lower: true });
    let i = 0;
    let players: Player[];
    let slug = baseSlug;

    do {
      players = await this.findAllBySlug(slug);
      if (players.length !== 0) {
        i = i + 1;
        slug = `${baseSlug}-${i}`;
      }
    } while (players.length !== 0);

    return slug;
  }

  findOneWithCurrentTeamDetails(id: string) {
    return this.prisma.player.findUnique({
      where: { id },
      include: {
        teams: {
          where: { endDate: null },
          include: {
            team: {
              include: {
                competitions: {
                  where: { season: { isActive: true } },
                  include: { competition: true, group: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto) {
    const { secondaryPositionIds, ...rest } = updatePlayerDto;

    // If user wants to update players secondary positions, first we need to delete all existing SecondaryPositionsOnPlayers records, then create new ones
    if (secondaryPositionIds && secondaryPositionIds.length !== 0) {
      await this.prisma.secondaryPositionsOnPlayers.deleteMany({
        where: { playerId: id },
      });
    }

    return this.prisma.player.update({
      where: { id },
      data: {
        ...rest,
        secondaryPositions:
          secondaryPositionIds && secondaryPositionIds.length > 0
            ? {
                createMany: {
                  data: secondaryPositionIds.map((id) => ({
                    playerPositionId: id,
                  })),
                },
              }
            : undefined,
      },
      include,
    });
  }

  async remove(id: string) {
    await Promise.all([
      this.prisma.teamAffiliation.deleteMany({ where: { playerId: id } }),
      this.prisma.secondaryPositionsOnPlayers.deleteMany({
        where: { playerId: id },
      }),
      this.prisma.userPlayerAccessControlEntry.deleteMany({
        where: { playerId: id },
      }),
      this.prisma.organizationPlayerAccessControlEntry.deleteMany({
        where: { playerId: id },
      }),
    ]);
    return this.prisma.player.delete({ where: { id } });
  }
}
