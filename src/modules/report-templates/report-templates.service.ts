import { Injectable } from '@nestjs/common';
import { Prisma, ReportTemplate } from '@prisma/client';

import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportTemplateDto } from './dto/create-report-template.dto';
import { FindAllReportTemplatesDto } from './dto/find-all-report-templates.dto';
import { ReportTemplatesPaginationOptionsDto } from './dto/report-templates-pagination-options.dto';
import { UpdateReportTemplateDto } from './dto/update-report-template.dto';

interface CsvInput {
  id: number;
  name: string;
  maxRatingScore: number;
  isPublic: boolean;
  scoutmakerv1Id: string;
  authorId: number;
  skillList: string;
}

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

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreateReportTemplateDto();

      instance.id = item.id?.toString();
      instance.name = item.name;
      instance.maxRatingScore = item.maxRatingScore;
      instance.isPublic = item.isPublic;
      instance.scoutmakerv1Id = item.scoutmakerv1Id;
      instance.skillAssessmentTemplateIds = item.skillList.split(',');

      return instance;
    });

    await validateInstances(instances);

    const createdDocuments: ReportTemplate[] = [];
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

  findOne(id: string) {
    return this.prisma.reportTemplate.findUnique({ where: { id }, include });
  }

  async update(id: string, updateReportTemplateDto: UpdateReportTemplateDto) {
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

  remove(id: string) {
    return this.prisma.reportTemplate.delete({ where: { id } });
  }
}
