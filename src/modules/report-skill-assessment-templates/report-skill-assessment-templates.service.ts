import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import {
  calculateSkip,
  formatPaginatedResponse,
  isIdsArrayFilterDefined,
} from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportSkillAssessmentTemplateDto } from './dto/create-report-skill-assessment-template.dto';
import { FindAllReportSkillAssessmentTemplatesDto } from './dto/find-all-report-skill-assessment-templates.dto';
import { ReportSkillAssessmentTemplatesPaginationOptionsDto } from './dto/report-skill-assessment-templates-pagination-options.dto';
import { UpdateReportSkillAssessmentTemplateDto } from './dto/update-report-skill-assessment-template.dto';

const include: Prisma.ReportSkillAssessmentTemplateInclude = {
  category: true,
};

@Injectable()
export class ReportSkillAssessmentTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    createReportSkillAssessmentTemplateDto: CreateReportSkillAssessmentTemplateDto,
    authorId: number,
  ) {
    const { categoryId, ...rest } = createReportSkillAssessmentTemplateDto;

    return this.prisma.reportSkillAssessmentTemplate.create({
      data: {
        ...rest,
        category: { connect: { id: categoryId } },
        author: { connect: { id: authorId } },
      },
      include,
    });
  }

  async findAll(
    {
      limit,
      page,
      sortBy,
      sortingOrder,
    }: ReportSkillAssessmentTemplatesPaginationOptionsDto,
    { name, categoryIds }: FindAllReportSkillAssessmentTemplatesDto,
  ) {
    const where: Prisma.ReportSkillAssessmentTemplateWhereInput = {
      name: { contains: name, mode: 'insensitive' },
      category: isIdsArrayFilterDefined(categoryIds)
        ? { id: { in: categoryIds } }
        : undefined,
    };

    const templates = await this.prisma.reportSkillAssessmentTemplate.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: { [sortBy]: sortingOrder },
      include,
    });

    const total = await this.prisma.reportSkillAssessmentTemplate.count({
      where,
    });

    return formatPaginatedResponse({
      docs: templates,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.reportSkillAssessmentTemplate.findMany({ include });
  }

  findOne(id: number) {
    return this.prisma.reportSkillAssessmentTemplate.findUnique({
      where: { id },
      include,
    });
  }

  update(
    id: number,
    updateReportSkillAssessmentTemplateDto: UpdateReportSkillAssessmentTemplateDto,
  ) {
    return this.prisma.reportSkillAssessmentTemplate.update({
      where: { id },
      data: updateReportSkillAssessmentTemplateDto,
      include,
    });
  }

  remove(id: number) {
    return this.prisma.reportSkillAssessmentTemplate.delete({
      where: { id },
      include,
    });
  }
}
