import { Injectable } from '@nestjs/common';
import { Prisma, ReportTemplate } from '@prisma/client';

import {
  calculateAvg,
  calculatePercentageRating,
  calculateSkip,
  formatPaginatedResponse,
} from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { ReportTemplatesService } from '../report-templates/report-templates.service';
import { CreateReportDto } from './dto/create-report.dto';
import { FindAllReportsDto } from './dto/find-all-reports.dto';
import { ReportsPaginationOptionsDto } from './dto/reports-pagination-options.dto';
import { UpdateReportDto } from './dto/update-report.dto';

const include: Prisma.ReportInclude = {
  template: true,
  player: {
    include: {
      country: true,
      primaryPosition: true,
      teams: { include: { team: true } },
    },
  },
  positionPlayed: true,
  match: { include: { homeTeam: true, awayTeam: true } },
  author: true,
  skills: { include: { template: { include: { category: true } } } },
};

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly templatesService: ReportTemplatesService,
  ) {}

  async create(createReportDto: CreateReportDto, authorId: string) {
    const {
      templateId,
      playerId,
      matchId,
      positionPlayedId,
      skillAssessments,
      finalRating,
      ...rest
    } = createReportDto;

    let percentageRating: number;
    let template: ReportTemplate;

    // Calculate percentage rating
    if (finalRating) {
      template = await this.templatesService.findOne(templateId);
      percentageRating = calculatePercentageRating(
        finalRating,
        template.maxRatingScore,
      );
    }

    // Calculate average rating
    const skillsRatings = skillAssessments
      .filter(({ rating }) => rating)
      .map(({ rating }) => rating);

    const avgRating = calculateAvg(skillsRatings);

    const areSkillAssessmentsIncluded =
      skillAssessments && skillAssessments.length > 0;

    return this.prisma.report.create({
      data: {
        ...rest,
        finalRating,
        percentageRating,
        avgRating,
        template: { connect: { id: templateId } },
        player: { connect: { id: playerId } },
        positionPlayed: positionPlayedId
          ? { connect: { id: positionPlayedId } }
          : undefined,
        match: matchId ? { connect: { id: matchId } } : undefined,
        author: { connect: { id: authorId } },
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
      include,
    });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: ReportsPaginationOptionsDto,
    {
      playerIds,
      positionIds,
      matchIds,
      teamIds,
      percentageRatingRangeStart,
      percentageRatingRangeEnd,
    }: FindAllReportsDto,
  ) {
    let sort: Prisma.ReportOrderByWithRelationInput;

    switch (sortBy) {
      case 'player':
      case 'author':
        sort = { [sortBy]: { lastName: sortingOrder } };
        break;
      case 'positionPlayed':
        sort = { positionPlayed: { name: sortingOrder } };
      default:
        sort = { [sortBy]: sortingOrder };
        break;
    }

    console.log({
      playerIds,
      positionIds,
      matchIds,
      teamIds,
      percentageRatingRangeStart,
      percentageRatingRangeEnd,
    });

    const where: Prisma.ReportWhereInput = {
      player: { id: { in: playerIds } },
      match: matchIds ? { id: { in: matchIds } } : undefined,
      percentageRating: {
        gte: percentageRatingRangeStart,
        lte: percentageRatingRangeEnd,
      },
      AND: [
        {
          OR: [
            { positionPlayed: { id: { in: positionIds } } },
            { player: { primaryPosition: { id: { in: positionIds } } } },
          ],
        },
        {
          OR: [
            teamIds
              ? { match: { homeTeam: { id: { in: teamIds } } } }
              : undefined,
            teamIds
              ? { match: { awayTeam: { id: { in: teamIds } } } }
              : undefined,
          ],
        },
      ],
    };

    const reports = await this.prisma.report.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include,
    });

    const total = await this.prisma.report.count({ where });

    return formatPaginatedResponse({
      docs: reports,
      totalDocs: total,
      limit,
      page,
    });
  }

  findOne(id) {
    return this.prisma.report.findUnique({ where: { id }, include });
  }

  async update(id, updateReportDto: UpdateReportDto) {
    const { skillAssessments, finalRating, ...rest } = updateReportDto;

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
      include,
    });

    // Calculate percentage rating
    let percentageRating: number;
    let template: ReportTemplate;

    if (finalRating) {
      template = await this.templatesService.findOne(updatedReport.templateId);
      percentageRating = calculatePercentageRating(
        finalRating,
        template.maxRatingScore,
      );

      updatedReport = await this.prisma.report.update({
        where: { id },
        data: { percentageRating },
      });
    }

    return updatedReport;
  }

  remove(id) {
    return this.prisma.report.delete({ where: { id }, include });
  }
}
