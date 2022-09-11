import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportTemplateDto } from './dto/create-report-template.dto';
import { FindAllReportTemplatesDto } from './dto/find-all-report-templates.dto';
import { ReportTemplatesPaginationOptionsDto } from './dto/report-templates-pagination-options.dto';
import { UpdateReportTemplateDto } from './dto/update-report-template.dto';

const include: Prisma.ReportTemplateInclude = {
  skillAssessmentTemplates: {
    include: { skillAssessmentTemplate: { include: { category: true } } },
  },
};

@Injectable()
export class ReportTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createReportTemplateDto: CreateReportTemplateDto, authorId: string) {
    const { skillAssessmentTemplateIds, ...rest } = createReportTemplateDto;

    return this.prisma.reportTemplate.create({
      data: {
        ...rest,
        author: { connect: { id: authorId } },
        skillAssessmentTemplates:
          skillAssessmentTemplateIds && skillAssessmentTemplateIds.length > 0
            ? {
                createMany: {
                  data: skillAssessmentTemplateIds.map((id) => ({
                    skillAssessmentTemplateId: id,
                  })),
                },
              }
            : undefined,
      },
      include,
    });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: ReportTemplatesPaginationOptionsDto,
    { name }: FindAllReportTemplatesDto,
  ) {
    const where: Prisma.ReportTemplateWhereInput = {
      name: { contains: name, mode: 'insensitive' },
    };

    const reportTemplates = await this.prisma.reportTemplate.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: { [sortBy]: sortingOrder },
      include,
    });

    const total = await this.prisma.reportTemplate.count({ where });

    return formatPaginatedResponse({
      docs: reportTemplates,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.reportTemplate.findMany({ include });
  }

  findOne(id: number) {
    return this.prisma.reportTemplate.findUnique({ where: { id }, include });
  }

  async update(id: number, updateReportTemplateDto: UpdateReportTemplateDto) {
    const { skillAssessmentTemplateIds, ...rest } = updateReportTemplateDto;

    // If user wants to update skill assessment templates included in the report template, first we need to delete all existing SkillAssessmentTemplatesOnReportTemplate records
    const shouldUpdateSkillAssessmentTemplates =
      skillAssessmentTemplateIds && skillAssessmentTemplateIds.length !== 0;

    if (shouldUpdateSkillAssessmentTemplates) {
      await this.prisma.skillAssessmentTemplatesOnReportTemplates.deleteMany({
        where: { reportTemplateId: id },
      });
    }

    return this.prisma.reportTemplate.update({
      where: { id },
      data: {
        ...rest,
        skillAssessmentTemplates: shouldUpdateSkillAssessmentTemplates
          ? {
              createMany: {
                data: skillAssessmentTemplateIds.map((id) => ({
                  skillAssessmentTemplateId: id,
                })),
              },
            }
          : undefined,
      },
      include,
    });
  }

  remove(id: number) {
    return this.prisma.reportTemplate.delete({ where: { id } });
  }
}
