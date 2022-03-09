import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllReportSkillAssessmentsDto } from './dto/find-all-report-skill-assessments.dto';
import { ReportSkillAssessmentsPaginationOptionsDto } from './dto/report-skill-assessments-pagination-options.dto';

const include: Prisma.ReportSkillAssessmentInclude = {
  template: true,
  report: { include: { match: true, player: true } },
};

@Injectable()
export class ReportSkillAssessmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    {
      limit,
      page,
      sortBy,
      sortingOrder,
    }: ReportSkillAssessmentsPaginationOptionsDto,
    { playerId, matchId }: FindAllReportSkillAssessmentsDto,
  ) {
    let sort: Prisma.ReportSkillAssessmentOrderByWithRelationInput;

    switch (sortBy) {
      case 'rating':
        sort = { rating: sortingOrder };
        break;
      case 'player':
        sort = { report: { player: { lastName: sortingOrder } } };
      case 'match':
        sort = { report: { match: { date: sortingOrder } } };
      default:
        sort = undefined;
        break;
    }

    const where: Prisma.ReportSkillAssessmentWhereInput = {
      report: { player: { id: playerId }, match: { id: matchId } },
    };

    const assessments = await this.prisma.reportSkillAssessment.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include,
    });

    const total = await this.prisma.reportSkillAssessment.count({ where });

    return formatPaginatedResponse({
      docs: assessments,
      totalDocs: total,
      limit,
      page,
    });
  }
}
