import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Player, Prisma, UserRole } from '@prisma/client';
import Redis from 'ioredis';
import slugify from 'slugify';

import { REDIS_TTL } from '../../utils/constants';
import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import {
  calculatePercentage,
  calculateSkip,
  formatPaginatedResponse,
  isIdsArrayFilterDefined,
} from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { FindAllPlayersDto } from './dto/find-all-players.dto';
import { PlayersPaginationOptionsDto } from './dto/players-pagination-options.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { FootEnum, RecentAverageRating } from './types';

type CsvFooted = 'R' | 'L' | 'both';
interface CsvInput {
  id: number;
  firstName: string;
  lastName: string;
  yearOfBirth: number | string;
  height?: number | string;
  weight?: number | string;
  footed?: 'R' | 'L' | 'both';
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
  primaryPosition: { include: { positionType: true } },
  secondaryPositions: { include: { position: true } },
  role: true,
  teams: {
    where: { endDate: null },
    include: {
      team: true,
    },
  },
  latestGrade: true,
  recentAveragePercentageRatings: true,
  _count: { select: { notes: true, reports: true } },
};

const listInclude: Prisma.PlayerInclude = {
  country: true,
  primaryPosition: { include: { positionType: true } },
  teams: { where: { endDate: null }, include: { team: true } },
};

const singleInclude = Prisma.validator<Prisma.PlayerInclude>()({
  country: true,
  primaryPosition: { include: { positionType: true } },
  secondaryPositions: { include: { position: true } },
  author: true,
  role: true,
  teams: {
    where: { endDate: null },
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
  latestGrade: true,
  _count: { select: { notes: true, reports: true } },
});

interface IGenerateWhereClauseArgs {
  query: FindAllPlayersDto;
  accessFilters?: Prisma.PlayerWhereInput;
  userId?: string;
  onlyValidGrades?: boolean;
}

@Injectable()
export class PlayersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  getRedisKey(id: string) {
    return `player:${id}`;
  }

  async deleteFromCache(id: string) {
    await this.redis.del(this.getRedisKey(id));
  }

  async setToCache(id: string, player: any) {
    await this.redis.set(
      this.getRedisKey(id),
      JSON.stringify(player),
      'EX',
      REDIS_TTL,
    );
  }

  getFromCache(id: string) {
    return this.redis.get(this.getRedisKey(id));
  }

  async create(
    createPlayerDto: CreatePlayerDto,
    authorId: string,
    authorRole?: UserRole,
  ) {
    const {
      countryId,
      primaryPositionId,
      secondaryPositionIds,
      teamId,
      roleId,
      ...rest
    } = createPlayerDto;

    const slug = await this.generateSlug(`${rest.lastName} ${rest.firstName}`);

    let authorRoleFinal = authorRole;

    if (!authorRoleFinal) {
      const author = await this.usersService.findCurrentWithCache(authorId);
      authorRoleFinal = author.role;
    }

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
        createdByRole: authorRoleFinal,
        role: roleId ? { connect: { id: roleId } } : undefined,
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
      instance.height = item.height ? +item.height : undefined;
      instance.weight = item.weight ? +item.weight : undefined;
      instance.footed = item.footed ? footedMap[item.footed] : undefined;
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
    onlyValidGrades,
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
      positionTypeIds,
      orderId,
      teamIds,
      hasNote,
      hasReport,
      hasAnyObservation,
      maxAverageRating,
      minAverageRating,
      roleIds,
      grades,
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
          latestGrade: isIdsArrayFilterDefined(grades)
            ? {
                grade: { in: grades },
                createdAt: {
                  gte: new Date(
                    new Date().getTime() - 183 * 24 * 60 * 60 * 1000,
                  ), // created 183 days ago
                },
              }
            : undefined,
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
          averagePercentageRating: {
            gte: minAverageRating
              ? calculatePercentage(minAverageRating, 4)
              : undefined,
            lte: maxAverageRating
              ? calculatePercentage(maxAverageRating, 4)
              : undefined,
          },
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
                    {
                      notes: {
                        some: {
                          meta: {
                            position: { id: { in: positionIds } },
                          },
                        },
                      },
                    },
                    {
                      reports: {
                        some: {
                          meta: {
                            position: { id: { in: positionIds } },
                          },
                        },
                      },
                    },
                  ]
                : undefined,
            },
            {
              OR: isIdsArrayFilterDefined(positionTypeIds)
                ? [
                    {
                      primaryPosition: {
                        positionType: { id: { in: positionTypeIds } },
                      },
                    },
                    {
                      secondaryPositions: {
                        some: {
                          position: {
                            positionType: { id: { in: positionTypeIds } },
                          },
                        },
                      },
                    },
                    {
                      notes: {
                        some: {
                          meta: {
                            position: {
                              positionType: { id: { in: positionTypeIds } },
                            },
                          },
                        },
                      },
                    },
                    {
                      reports: {
                        some: {
                          meta: {
                            position: {
                              positionType: { id: { in: positionTypeIds } },
                            },
                          },
                        },
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
            {
              role: isIdsArrayFilterDefined(roleIds)
                ? { id: { in: roleIds } }
                : undefined,
            },
            {
              latestGrade: onlyValidGrades
                ? {
                    createdAt: {
                      gte: new Date(
                        new Date().getTime() - 183 * 24 * 60 * 60 * 1000,
                      ), // created 183 days ago
                    },
                  }
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

      case 'averagePercentageRating':
        switch (query.recentAverageRating) {
          case RecentAverageRating.LASTMONTH:
            sort = {
              recentAveragePercentageRatings: {
                lastMonth: { sort: sortingOrder, nulls: 'last' },
              },
            };
            break;
          case RecentAverageRating.LAST3MONTHS:
            sort = {
              recentAveragePercentageRatings: {
                last3Months: { sort: sortingOrder, nulls: 'last' },
              },
            };
            break;
          case RecentAverageRating.LAST6MONTHS:
            sort = {
              recentAveragePercentageRatings: {
                last6Months: { sort: sortingOrder, nulls: 'last' },
              },
            };
            break;
          case RecentAverageRating.LAST12MONTHS:
            sort = {
              recentAveragePercentageRatings: {
                last12Months: { sort: sortingOrder, nulls: 'last' },
              },
            };
            break;
          default:
            sort = { [sortBy]: { sort: sortingOrder, nulls: 'last' } };
            break;
        }
        break;

      case 'grade':
        sort = { latestGrade: { grade: sortingOrder } };
        break;

      default:
        sort = { [sortBy]: sortingOrder };
        break;
    }

    const where = this.generateWhereClause({
      query,
      userId,
      accessFilters,
      onlyValidGrades: sortBy === 'grade',
    });

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
    const cached = await this.getFromCache(id);

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

    this.setToCache(id, player);

    return player;
  }

  async findOneBySlug(slug: string, userId?: string) {
    const cached = await this.getFromCache(slug);

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

    this.setToCache(slug, player);

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

    const updated = await this.prisma.player.update({
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

    this.deleteFromCache(updated.slug);
    this.deleteFromCache(updated.id);

    return updated;
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
    const deleted = await this.prisma.player.delete({ where: { id } });
    this.deleteFromCache(deleted.slug);
    this.deleteFromCache(deleted.id);
    return deleted;
  }

  getCount(filters?: Prisma.PlayerWhereInput) {
    return this.prisma.player.count({ where: filters });
  }

  async fillAveragePercentageRating(playerId: string) {
    const args = Prisma.validator<
      Prisma.ReportAggregateArgs | Prisma.NoteAggregateArgs
    >()({
      where: {
        playerId,
        percentageRating: { not: null },
      },
      _sum: { percentageRating: true },
      _count: { percentageRating: true },
    });

    const [notes, reports] = await Promise.all([
      this.prisma.note.aggregate(args),
      this.prisma.report.aggregate(args),
    ]);
    const sumAvgRating =
      notes._sum.percentageRating + reports._sum.percentageRating;
    const countAvgRating =
      reports._count.percentageRating + notes._count.percentageRating;

    const averagePercentageRating = sumAvgRating / countAvgRating;

    await this.update(playerId, { averagePercentageRating });
  }

  async setLatestGradeIfExists(playerId: string) {
    const grade = await this.prisma.playerGrade.findMany({
      where: { playerId },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    if (grade.length) {
      await this.update(playerId, { latestGradeId: grade[0].id });
    }
  }
}
