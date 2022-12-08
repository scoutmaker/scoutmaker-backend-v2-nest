import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import Redis from 'ioredis';
import slugify from 'slugify';

import { REDIS_TTL } from '../../utils/constants';
import { parseCsv, validateInstances } from '../../utils/csv-helpers';
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
import { FootEnum } from './types';

type CsvFooted = 'R' | 'L' | 'both';
interface CsvInput {
  id: number;
  firstName: string;
  lastName: string;
  yearOfBirth: number | string;
  height?: number | string;
  weight?: number | string;
  footed: 'R' | 'L' | 'both';
  lnpId?: number;
  lnpUrl?: string;
  minut90id?: string;
  minut90url?: string;
  transfermarktId?: number;
  transfermarktUrl?: string;
  isPublic?: boolean;
  scoutmakerv1Id?: string;
  countryId: number;
  primaryPositionId: number;
  primaryPositionid?: number;
  authorId: number;
}

const footedMap: Record<CsvFooted, FootEnum> = {
  R: FootEnum.RIGHT,
  L: FootEnum.LEFT,
  both: FootEnum.BOTH,
};

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

interface IGenerateWhereClauseArgs {
  query: FindAllPlayersDto;
  accessFilters?: Prisma.PlayerWhereInput;
  userId?: string;
}

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
        teams: teamId
          ? { create: { teamId, startDate: new Date(), endDate: null } }
          : undefined,
        author: { connect: { id: authorId } },
      },
      include,
    });
  }

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreatePlayerDto();
      instance.id = item.id?.toString();
      instance.firstName = item.firstName;
      instance.lastName = item.lastName;
      instance.yearOfBirth =
        typeof item.yearOfBirth === 'string' ? 2000 : item.yearOfBirth || 2000;
      instance.height =
        typeof item.height === 'string' ? 170 : item.height || 170;
      instance.weight =
        typeof item.weight === 'string' ? 70 : item.weight || 70;
      instance.footed = footedMap[item.footed];
      instance.lnpId = item.lnpId?.toString();
      instance.lnpUrl = item.lnpUrl;
      instance.minut90id = item.minut90id;
      instance.minut90url = item.minut90url;
      instance.transfermarktId = item.transfermarktId?.toString();
      instance.transfermarktUrl = item.transfermarktUrl;
      instance.isPublic = item.isPublic || false;
      instance.scoutmakerv1Id = item.scoutmakerv1Id;
      instance.countryId = item.countryId?.toString();
      instance.primaryPositionId =
        item.primaryPositionid?.toString() ||
        item.primaryPositionId?.toString();

      return instance;
    });

    await validateInstances(instances);

    const createdDocuments: Player[] = [];
    const errors: any[] = [];

    for (const [index, instance] of instances.entries()) {
      try {
        const created = await this.create(
          instance,
          result.data[index].authorId.toString(),
        );
        createdDocuments.push(created);
      } catch (error) {
        errors.push({
          index,
          name: `${instance.firstName} ${instance.lastName}`,
          error,
        });
      }
    }

    return {
      csvRowsCount: result.data.length,
      createdCount: createdDocuments.length,
      errors,
    };
  }

  private generateWhereClause({
    query,
    accessFilters,
    userId,
  }: IGenerateWhereClauseArgs): Prisma.PlayerWhereInput {
    const {
      bornAfter,
      bornBefore,
      competitionIds,
      competitionGroupIds,
      countryIds,
      footed,
      isLiked,
      name,
      positionIds,
      orderId,
      teamIds,
      hasNote,
      hasReport,
      hasAnyObservation,
    } = query;

    const slugfiedQueryString = name
      ? slugify(name, {
          lower: true,
        })
      : undefined;

    const slugifiedReversedQueryString = name
      ? slugify(name.split(' ').reverse().join(' '), {
          lower: true,
        })
      : undefined;

    return {
      AND: [
        accessFilters,
        {
          yearOfBirth: { gte: bornAfter, lte: bornBefore },
          orders: orderId ? { some: { id: orderId } } : undefined,
          footed,
          country: isIdsArrayFilterDefined(countryIds)
            ? {
                id: { in: countryIds },
              }
            : undefined,
          likes: isLiked ? { some: { userId } } : undefined,
          notes: hasNote ? { some: {} } : undefined,
          reports: hasReport ? { some: {} } : undefined,
          AND: [
            {
              OR: [
                { firstName: { contains: name, mode: 'insensitive' } },
                { lastName: { contains: name, mode: 'insensitive' } },
                {
                  slug: {
                    contains: slugifiedReversedQueryString,
                    mode: 'insensitive',
                  },
                },
                {
                  slug: {
                    contains: slugfiedQueryString,
                    mode: 'insensitive',
                  },
                },
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
            {
              OR: hasAnyObservation
                ? [{ notes: { some: {} } }, { reports: { some: {} } }]
                : undefined,
            },
          ],
        },
      ],
    };
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: PlayersPaginationOptionsDto,
    query: FindAllPlayersDto,
    userId?: string,
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

    const where = this.generateWhereClause({ query, userId, accessFilters });

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

  getList(
    query: FindAllPlayersDto,
    userId?: string,
    accessFilters?: Prisma.PlayerWhereInput,
  ) {
    const where = this.generateWhereClause({ query, userId, accessFilters });

    return this.prisma.player.findMany({
      where,
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

  async findOneBySlug(slug: string, userId?: string) {
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
