import { Injectable } from '@nestjs/common';
import { Prisma, ReportTemplate } from '@prisma/client';

import {
  calculateAvg,
  calculatePercentageRating,
  calculateSkip,
  formatPaginatedResponse,
} from '../../utils/helpers';
import { PlayersService } from '../players/players.service';
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
  match: { include: { homeTeam: true, awayTeam: true } },
  author: true,
  skills: { include: { template: { include: { category: true } } } },
};

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly templatesService: ReportTemplatesService,
    private readonly playersService: PlayersService,
  ) {}

  async create(createReportDto: CreateReportDto, authorId: string) {
    const {
      templateId,
      playerId,
      matchId,
      positionPlayedId,
      teamId,
      competitionId,
      competitionGroupId,
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

    // Calculate report meta data
    const player = await this.playersService.findOneWithCurrentTeamDetails(
      playerId,
    );

    const metaPositionId = positionPlayedId || player.primaryPositionId;
    const metaTeamId = teamId || player.teams[0].teamId;
    const metaCompetitionId =
      competitionId || player.teams[0].team.competitions[0].competitionId;
    const metaCompetitionGroupId =
      competitionGroupId || player.teams[0].team.competitions[0].groupId;

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
        meta: {
          create: {
            position: { connect: { id: metaPositionId } },
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
        sort = { meta: { position: { name: sortingOrder } } };
      default:
        sort = { [sortBy]: sortingOrder };
        break;
    }

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
            { meta: { position: { id: { in: positionIds } } } },
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
            teamIds ? { meta: { team: { id: { in: teamIds } } } } : undefined,
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
    const {
      skillAssessments,
      playerId,
      positionPlayedId,
      teamId,
      competitionId,
      competitionGroupId,
      finalRating,
      ...rest
    } = updateReportDto;

    let metaPositionId: string;
    let metaTeamId: string;
    let metaCompetitionId: string;
    let metaCompetitionGroupId: string | undefined;

    // If there's playerId in the update, we need to update the meta with calculated values
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

      await this.prisma.reportMeta.update({
        where: { reportId: id },
        data: {
          positionId: metaPositionId,
          teamId: metaTeamId,
          competitionId: metaCompetitionId,
          competitionGroupId: metaCompetitionGroupId,
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

  async remove(id) {
    await this.prisma.reportMeta.delete({ where: { reportId: id } });
    return this.prisma.report.delete({ where: { id }, include });
  }
}
