import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Prisma, Report, UserRole } from '@prisma/client';
import Redis from 'ioredis';

import { percentageRatingRanges, REDIS_TTL } from '../../utils/constants';
import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import {
  calculateAvg,
  calculatePercentage,
  calculateSkip,
  formatPaginatedResponse,
  isIdsArrayFilterDefined,
} from '../../utils/helpers';
import { MatchesService } from '../matches/matches.service';
import { PlayersService } from '../players/players.service';
import { PrismaService } from '../prisma/prisma.service';
import { ReportTemplatesService } from '../report-templates/report-templates.service';
import { UsersService } from '../users/users.service';
import { CreateReportDto } from './dto/create-report.dto';
import { FindAllReportsDto } from './dto/find-all-reports.dto';
import { ReportsPaginationOptionsDto } from './dto/reports-pagination-options.dto';
import { UpdateReportDto } from './dto/update-report.dto';

interface CsvInput {
  id: number;
  shirtNo?: number;
  minutesPlayed?: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
  videoUrl?: string;
  videoDescription?: string;
  finalRating: number;
  summary: string;
  playerId: number;
  orderId?: number;
  positionPlayedId?: number;
  teamId?: number;
  competitionId?: number;
  competitionGroupId?: number;
  matchId?: number;
  authorId: number;
  skillAssessments: string;
  maxRatingScore: number;
}

const include: Prisma.ReportInclude = {
  player: {
    include: {
      country: true,
      primaryPosition: true,
      teams: { include: { team: true }, where: { endDate: null } },
    },
  },
  match: { include: { homeTeam: true, awayTeam: true } },
  author: { include: { profile: true } },
  skills: { include: { template: { include: { category: true } } } },
};

const paginatedDataInclude = Prisma.validator<Prisma.ReportInclude>()({
  player: true,
  author: { include: { profile: true } },
  match: { include: { homeTeam: true, awayTeam: true } },
  meta: {
    include: { team: true, position: { include: { positionType: true } } },
  },
});

const singleInclude = Prisma.validator<Prisma.ReportInclude>()({
  player: {
    include: {
      country: true,
      primaryPosition: true,
      teams: { include: { team: true }, where: { endDate: null } },
    },
  },
  match: { include: { homeTeam: true, awayTeam: true, competition: true } },
  author: { include: { profile: true } },
  skills: { include: { template: { include: { category: true } } } },
  meta: {
    include: {
      competition: true,
      competitionGroup: true,
      position: { include: { positionType: true } },
      team: true,
    },
  },
});

const listInclude: Prisma.ReportInclude = {
  player: {
    include: {
      country: true,
      primaryPosition: true,
      teams: { include: { team: true }, where: { endDate: null } },
    },
  },
  author: true,
};

interface IGenerateWhereClauseArgs {
  query: FindAllReportsDto;
  accessFilters?: Prisma.ReportWhereInput;
  userId?: string;
}

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly templatesService: ReportTemplatesService,
    private readonly playersService: PlayersService,
    private readonly usersService: UsersService,
    private readonly matchesService: MatchesService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  private getCacheKey(id: string) {
    return `report:${id}`;
  }

  private getOneFromCache(id: string) {
    return this.redis.get(this.getCacheKey(id));
  }

  private saveOneToCache<T extends Report>(report: T) {
    return this.redis.set(
      this.getCacheKey(report.id),
      JSON.stringify(report),
      'EX',
      REDIS_TTL,
    );
  }

  async create(
    createReportDto: CreateReportDto,
    authorId: string,
    authorRole?: UserRole,
  ) {
    const {
      templateId,
      playerId,
      matchId,
      positionPlayedId,
      teamId,
      competitionId,
      competitionGroupId,
      orderId,
      skillAssessments,
      finalRating,
      maxRatingScore,
      ...rest
    } = createReportDto;

    let template:
      | Awaited<ReturnType<typeof this.templatesService.findOne>>
      | undefined;

    if (templateId) {
      template = await this.templatesService.findOne(templateId);
    }

    let percentageRating: number;

    // Calculate percentage rating
    if (finalRating) {
      percentageRating = calculatePercentage(
        finalRating,
        maxRatingScore || template?.maxRatingScore,
      );
    }

    // Calculate average rating
    const skillsRatings = skillAssessments
      .filter(({ rating }) => rating)
      .map(({ rating }) => rating);

    const avgRating = calculateAvg(skillsRatings);

    // Calculate report meta data
    const player = await this.playersService.findOneWithCurrentTeamDetails(
      playerId,
    );
    const team = matchId
      ? await this.matchesService.getPlayerTeamInMatch(playerId, matchId)
      : { team: player.teams[0].team, notMatched: undefined };
    const metaPositionId = positionPlayedId || player.primaryPositionId;
    const metaTeamId = teamId || team?.team.id;
    const metaCompetitionId =
      competitionId || team?.team.competitions[0]?.competitionId;
    const metaCompetitionGroupId =
      competitionGroupId || team?.team.competitions[0]?.groupId;

    const areSkillAssessmentsIncluded =
      skillAssessments && skillAssessments.length > 0;

    let authorRoleFinal = authorRole;

    if (!authorRoleFinal) {
      const author = await this.usersService.findCurrentWithCache(authorId);
      authorRoleFinal = author.role;
    }

    const createdReport = await this.prisma.report.create({
      data: {
        ...rest,
        finalRating,
        percentageRating,
        skillsOrder: template
          ? template.skillAssessmentTemplates.map(
              ({ skillAssessmentTemplate: { id, shortName } }) =>
                `${id}::${shortName}`,
            )
          : undefined,
        compactCategoriesIds: template?.compactCategoriesIds,
        avgRating: !Number.isNaN(avgRating) ? avgRating : undefined,
        maxRatingScore: maxRatingScore || template?.maxRatingScore,
        player: { connect: { id: playerId } },
        order: orderId ? { connect: { id: orderId } } : undefined,
        match: matchId ? { connect: { id: matchId } } : undefined,
        author: { connect: { id: authorId } },
        createdByRole: authorRoleFinal,
        skills: areSkillAssessmentsIncluded
          ? {
              createMany: {
                data: skillAssessments.map(
                  ({ templateId, description, rating }) => ({
                    templateId,
                    description,
                    rating,
                  }),
                ),
              },
            }
          : undefined,
        meta: {
          create: {
            position: { connect: { id: metaPositionId } },
            team: metaTeamId ? { connect: { id: metaTeamId } } : undefined,
            competition: metaCompetitionId
              ? { connect: { id: metaCompetitionId } }
              : undefined,
            competitionGroup: metaCompetitionGroupId
              ? { connect: { id: metaCompetitionGroupId } }
              : undefined,
            notMatched: team.notMatched,
          },
        },
      },
      include,
    });

    if (playerId) this.playersService.fillAveragePercentageRating(playerId);

    return createdReport;
  }

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreateReportDto();

      const parsedAssessments = JSON.parse(item.skillAssessments).map(
        (item) => ({
          ...item,
          rating: item.rating === 'null' ? null : parseInt(item.rating),
          description: item.description === 'null' ? null : item.description,
        }),
      );

      instance.id = item.id?.toString();
      instance.shirtNo = item.shirtNo;
      instance.minutesPlayed = item.minutesPlayed;
      instance.goals = item.goals;
      instance.assists = item.assists;
      instance.yellowCards = item.yellowCards;
      instance.redCards = item.redCards;
      instance.videoUrl = item.videoUrl;
      instance.videoDescription = item.videoDescription;
      instance.finalRating = item.finalRating;
      instance.summary = item.summary;
      instance.playerId = item.playerId.toString();
      instance.orderId = item.orderId?.toString();
      instance.positionPlayedId = item.positionPlayedId?.toString();
      instance.teamId = item.teamId?.toString();
      instance.competitionId = item.competitionId?.toString();
      instance.competitionGroupId = item.competitionGroupId?.toString();
      instance.matchId = item.matchId?.toString();
      instance.maxRatingScore = item.maxRatingScore;
      instance.skillAssessments = parsedAssessments;

      return instance;
    });

    await validateInstances(instances);

    const createdDocuments: Report[] = [];
    const errors: any[] = [];

    for (const [index, instance] of instances.entries()) {
      try {
        const created = await this.create(
          instance,
          result.data[index].authorId?.toString(),
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

  private generateWhereClause({
    query,
    accessFilters,
    userId,
  }: IGenerateWhereClauseArgs): Prisma.ReportWhereInput {
    const {
      playerIds,
      positionIds,
      positionTypeIds,
      matchIds,
      teamIds,
      competitionIds,
      competitionGroupIds,
      percentageRatingRangeStart,
      percentageRatingRangeEnd,
      playerBornAfter,
      playerBornBefore,
      hasVideo,
      isLiked,
      userId: userIdFindParam,
      observationType,
      onlyLikedPlayers,
      onlyLikedTeams,
      percentageRatingRanges: percentageRatingRangesFilter,
      onlyMine,
      seasonIds,
    } = query;

    return {
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
          videoUrl: hasVideo ? { not: null } : undefined,
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
                      meta: { position: null },
                      player: { primaryPosition: { id: { in: positionIds } } },
                    },
                  ]
                : undefined,
            },
            {
              OR: isIdsArrayFilterDefined(positionTypeIds)
                ? [
                    {
                      meta: {
                        position: {
                          positionType: { id: { in: positionTypeIds } },
                        },
                      },
                    },
                    {
                      meta: {
                        position: null,
                      },
                      player: {
                        primaryPosition: {
                          positionType: { id: { in: positionTypeIds } },
                        },
                      },
                    },
                  ]
                : undefined,
            },
            {
              meta: isIdsArrayFilterDefined(teamIds)
                ? { team: { id: { in: teamIds } } }
                : undefined,
            },
            {
              player: playerBornAfter
                ? {
                    yearOfBirth: {
                      gte: playerBornAfter,
                    },
                  }
                : undefined,
            },
            {
              player: playerBornBefore
                ? {
                    yearOfBirth: {
                      lte: playerBornBefore,
                    },
                  }
                : undefined,
            },
            {
              player: onlyLikedPlayers
                ? { likes: { some: { userId } } }
                : undefined,
            },
            {
              meta: onlyLikedTeams
                ? { team: { likes: { some: { userId } } } }
                : undefined,
            },
            {
              OR: percentageRatingRangesFilter?.map((range) => ({
                percentageRating: {
                  gte: percentageRatingRanges[range][0],
                  lte: percentageRatingRanges[range][1],
                },
              })),
            },
            { authorId: onlyMine ? userId : undefined },
            {
              match: isIdsArrayFilterDefined(seasonIds)
                ? { seasonId: { in: seasonIds } }
                : undefined,
            },
          ],
        },
      ],
    };
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: ReportsPaginationOptionsDto,
    query: FindAllReportsDto,
    userId?: string,
    accessFilters?: Prisma.ReportWhereInput,
  ) {
    let sort: Prisma.ReportOrderByWithRelationInput;

    switch (sortBy) {
      case 'player':
      case 'author':
        sort = { [sortBy]: { lastName: sortingOrder } };
        break;
      case 'positionPlayed':
        sort = { meta: { position: { name: sortingOrder } } };
      case 'match':
        sort = { match: { date: sortingOrder } };
        break;
      default:
        sort = { [sortBy]: sortingOrder };
        break;
    }

    const where = this.generateWhereClause({ query, accessFilters, userId });

    const reports = await this.prisma.report.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit) || 0,
      orderBy: sort,
      include: userId
        ? { ...paginatedDataInclude, likes: { where: { userId } } }
        : paginatedDataInclude,
    });

    const total = await this.prisma.report.count({ where });

    return formatPaginatedResponse({
      docs: reports,
      totalDocs: total,
      limit,
      page,
    });
  }

  async findOne(
    id: string,
    userId?: string,
  ): Promise<Prisma.ReportGetPayload<{ include: typeof singleInclude }>> {
    const cached = await this.getOneFromCache(id);

    if (cached) {
      return JSON.parse(cached);
    }

    const report = await this.prisma.report.findUnique({
      where: { id },
      include: userId
        ? { ...singleInclude, likes: { where: { userId } } }
        : singleInclude,
    });
    await this.saveOneToCache(report);

    return report;
  }

  async update(id: string, updateReportDto: UpdateReportDto) {
    const {
      skillAssessments,
      playerId,
      positionPlayedId,
      teamId,
      competitionId,
      competitionGroupId,
      finalRating,
      matchId,
      ...rest
    } = updateReportDto;

    let metaPositionId: string;
    let metaTeamId: string;
    let metaCompetitionId: string;
    let metaCompetitionGroupId: string | undefined;

    // If there's playerId in the update, we need to update the meta with calculated values
    if (playerId) {
      const [player, report] = await Promise.all([
        this.playersService.findOneWithCurrentTeamDetails(playerId),
        this.findOne(id),
      ]);
      const team = await this.matchesService.getPlayerTeamInMatch(
        playerId,
        matchId || report.matchId,
      );
      metaPositionId = positionPlayedId || player.primaryPositionId;
      metaTeamId = teamId || team.team.id;
      metaCompetitionId =
        competitionId || team?.team.competitions[0]?.competitionId;
      metaCompetitionGroupId =
        competitionGroupId || team?.team.competitions[0]?.groupId;

      await this.prisma.reportMeta.update({
        where: { reportId: id },
        data: {
          positionId: metaPositionId,
          teamId: metaTeamId,
          competitionId: metaCompetitionId,
          competitionGroupId: metaCompetitionGroupId,
          notMatched: team?.notMatched,
        },
      });
    } else if (!teamId && matchId) {
      const report = await this.findOne(id);
      const team = await this.matchesService.getPlayerTeamInMatch(
        report.playerId,
        matchId,
      );
      await this.prisma.reportMeta.update({
        where: { reportId: id },
        data: {
          teamId: team.team.id,
          notMatched: team?.notMatched,
        },
      });
    }

    // If there's no playerId in the update and there's meta data provided, we need to update the meta with provided values
    if (
      !playerId &&
      (positionPlayedId || teamId || competitionId || competitionGroupId)
    ) {
      await this.prisma.reportMeta.update({
        where: { reportId: id },
        data: {
          teamId,
          competitionId,
          competitionGroupId,
          positionId: positionPlayedId,
        },
      });
    }

    const areSkillAssessmentsIncluded =
      skillAssessments && skillAssessments.length > 0;

    // If the user wants to update skill assessments, first we need to remove all existing ones
    if (areSkillAssessmentsIncluded) {
      await this.prisma.reportSkillAssessment.deleteMany({
        where: { reportId: id },
      });
    }

    // Calculate average rating
    let avgRating: number;

    if (areSkillAssessmentsIncluded) {
      const skillsRatings = skillAssessments
        .filter(({ rating }) => rating)
        .map(({ rating }) => rating);

      avgRating = calculateAvg(skillsRatings);
    }

    let updatedReport = await this.prisma.report.update({
      where: { id },
      data: {
        ...rest,
        matchId,
        playerId,
        finalRating,
        avgRating,
        skills: areSkillAssessmentsIncluded
          ? {
              createMany: {
                data: skillAssessments.map(
                  ({ templateId, description, rating }) => ({
                    templateId,
                    description,
                    rating,
                  }),
                ),
              },
            }
          : undefined,
      },
      include: singleInclude,
    });

    // Calculate percentage rating
    let percentageRating: number;

    if (finalRating) {
      percentageRating = calculatePercentage(
        finalRating,
        updatedReport.maxRatingScore,
      );

      updatedReport = await this.prisma.report.update({
        where: { id },
        data: { percentageRating },
        include: singleInclude,
      });
    }

    this.saveOneToCache(updatedReport);

    if (updateReportDto.playerId)
      this.playersService.fillAveragePercentageRating(updateReportDto.playerId);

    return updatedReport;
  }

  async remove(id: string) {
    return this.prisma.report.delete({ where: { id }, include });
  }

  getList(
    query: FindAllReportsDto,
    userId?: string,
    accessFilters?: Prisma.ReportWhereInput,
  ) {
    const where = this.generateWhereClause({ query, userId, accessFilters });

    return this.prisma.report.findMany({ where, include: listInclude });
  }

  getCount(filters: Prisma.ReportWhereInput) {
    return this.prisma.report.count({ where: filters });
  }
}
