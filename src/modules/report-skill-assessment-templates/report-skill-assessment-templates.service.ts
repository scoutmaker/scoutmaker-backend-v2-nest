import { Injectable } from '@nestjs/common';
import { Prisma, ReportSkillAssessmentTemplate } from '@prisma/client';

import { parseCsv, validateInstances } from '../../utils/csv-helpers';
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

interface CsvInput {
  id: number;
  name: string;
  shortName: string;
  hasScore: boolean;
  scoutmakerv1Id: string;
  categoryId: number;
  authorId: number;
}

const include: Prisma.ReportSkillAssessmentTemplateInclude = {
  category: true,
};

@Injectable()
export class ReportSkillAssessmentTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    createReportSkillAssessmentTemplateDto: CreateReportSkillAssessmentTemplateDto,
    authorId: string,
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

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreateReportSkillAssessmentTemplateDto();

      instance.id = item.id?.toString();
      instance.name = item.name;
      instance.hasScore = item.hasScore;
      instance.shortName = item.shortName;
      instance.scoutmakerv1Id = item.scoutmakerv1Id;
      instance.categoryId = item.categoryId.toString();

      return instance;
    });

    await validateInstances(instances);

    const createdDocuments: ReportSkillAssessmentTemplate[] = [];
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

  findOne(id: string) {
    return this.prisma.reportSkillAssessmentTemplate.findUnique({
      where: { id },
      include,
    });
  }

  update(
    id: string,
    updateReportSkillAssessmentTemplateDto: UpdateReportSkillAssessmentTemplateDto,
  ) {
    return this.prisma.reportSkillAssessmentTemplate.update({
      where: { id },
      data: updateReportSkillAssessmentTemplateDto,
      include,
    });
  }

  remove(id: string) {
    return this.prisma.reportSkillAssessmentTemplate.delete({
      where: { id },
      include,
    });
  }
}
