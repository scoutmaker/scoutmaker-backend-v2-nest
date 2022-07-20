import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import Redis from 'ioredis';
import slugify from 'slugify';

import { REDIS_TTL } from '../../utils/constants';
import {
  calculateSkip,
  formatPaginatedResponse,
  isIdsArrayFilterDefined,
} from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { FindAllPlayersDto } from './dto/find-all-players.dto';
import { PlayersPaginationOptionsDto } from './dto/players-pagination-options.dto';
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
  _count: { select: { notes: true, reports: true } },
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
  _count: { select: { notes: true, reports: true } },
});

@Injectable()
export class PlayersService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async create(createPlayerDto: CreatePlayerDto, authorId: number) {
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
    {
      bornAfter,
      bornBefore,
      competitionIds,
      competitionGroupIds,
      countryIds,
      footed,
      isLiked,
      name,
      positionIds,
      teamIds,
    }: FindAllPlayersDto,
    userId?: number,
    accessFilters?: Prisma.PlayerWhereInput,
  ) {
    let sort: Prisma.PlayerOrderByWithRelationInput;

    switch (sortBy) {
      case 'country':
      case 'primaryPosition':
        sort = { [sortBy]: { name: sortingOrder } };
        break;

      case 'reportsCount':
        sort = { reports: { _count: sortingOrder } };
        break;

      case 'notesCount':
        sort = { notes: { _count: sortingOrder } };
        break;

      default:
        sort = { [sortBy]: sortingOrder };
        break;
    }

    const where: Prisma.PlayerWhereInput = {
      AND: [
        accessFilters,
        {
          yearOfBirth: { gte: bornAfter, lte: bornBefore },
          footed,
          country: isIdsArrayFilterDefined(countryIds)
            ? {
                id: { in: countryIds },
              }
            : undefined,
          likes: isLiked ? { some: { userId } } : undefined,
          AND: [
            {
              OR: [
                { firstName: { contains: name, mode: 'insensitive' } },
                { lastName: { contains: name, mode: 'insensitive' } },
              ],
            },
            {
              OR: isIdsArrayFilterDefined(positionIds)
                ? [
                    { primaryPosition: { id: { in: positionIds } } },
                    {
                      secondaryPositions: {
                        some: { playerPositionId: { in: positionIds } },
                      },
                    },
                  ]
                : undefined,
            },
            {
              teams: isIdsArrayFilterDefined(teamIds)
                ? { some: { teamId: { in: teamIds }, endDate: null } }
                : undefined,
            },
            {
              teams: isIdsArrayFilterDefined(competitionIds)
                ? {
                    some: {
                      endDate: null,
                      team: {
                        competitions: {
                          some: {
                            competition: { id: { in: competitionIds } },
                            season: { isActive: true },
                          },
                        },
                      },
                    },
                  }
                : undefined,
            },
            {
              teams: isIdsArrayFilterDefined(competitionGroupIds)
                ? {
                    some: {
                      endDate: null,
                      team: {
                        competitions: {
                          some: {
                            group: { id: { in: competitionGroupIds } },
                            season: { isActive: true },
                          },
                        },
                      },
                    },
                  }
                : undefined,
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
      include: userId
        ? {
            ...include,
            likes: {
              where: { userId },
            },
          }
        : include,
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

  async findOne(id: number, userId?: number) {
    const redisKey = `player:${id}`;

    const cached = await this.redis.get(redisKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const player = await this.prisma.player.findUnique({
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

    await this.redis.set(redisKey, JSON.stringify(player), 'EX', REDIS_TTL);

    return player;
  }

  async findOneBySlug(slug: string, userId?: number) {
    const redisKey = `player:${slug}`;

    const cached = await this.redis.get(redisKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const player = await this.prisma.player.findUnique({
      where: { slug },
      include: userId
        ? {
            ...singleInclude,
            likes: {
              where: { userId },
            },
          }
        : singleInclude,
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

  findOneWithCurrentTeamDetails(id: number) {
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

  async update(id: number, updatePlayerDto: UpdatePlayerDto) {
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

  async remove(id: number) {
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
