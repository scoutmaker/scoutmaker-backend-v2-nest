import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateReportTemplateDto } from './dto/create-report-template.dto';
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

  findAll() {
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
