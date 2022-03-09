import { Injectable } from '@nestjs/common';
import { Prisma, ReportTemplate } from '@prisma/client';

import { calculateAvg, calculatePercentageRating } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { ReportTemplatesService } from '../report-templates/report-templates.service';
import { CreateReportDto } from './dto/create-report.dto';
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

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id) {
    return this.prisma.report.findUnique({ where: { id }, include });
  }

  update(id, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id) {
    return `This action removes a #${id} report`;
  }
}
