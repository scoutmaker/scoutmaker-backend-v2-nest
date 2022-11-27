import { Injectable } from '@nestjs/common';
import { Prisma, ReportSkillAssessmentCategory } from '@prisma/client';

import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportSkillAssessmentCategoryDto } from './dto/create-report-skill-assessment-category.dto';
import { FindAllReportSkillAssessmentCategoriesDto } from './dto/find-all-report-skill-assessment-categories.dto';
import { ReportSkillAssessmentCategoriesPaginationOptionsDto } from './dto/report-skill-assessment-categories-pagination-options.dto';
import { UpdateReportSkillAssessmentCategoryDto } from './dto/update-report-skill-assessment-category.dto';

interface CsvInput {
  id: number;
  name: string;
  isPublic: boolean;
  authorId: number;
}

@Injectable()
export class ReportSkillAssessmentCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    createReportSkillAssessmentCategoryDto: CreateReportSkillAssessmentCategoryDto,
    authorId: string,
  ) {
    return this.prisma.reportSkillAssessmentCategory.create({
      data: {
        ...createReportSkillAssessmentCategoryDto,
        author: { connect: { id: authorId } },
      },
    });
  }

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreateReportSkillAssessmentCategoryDto();

      instance.id = item.id?.toString();
      instance.name = item.name;
      instance.isPublic = item.isPublic;

      return instance;
    });

    await validateInstances(instances);

    const createdDocuments: ReportSkillAssessmentCategory[] = [];
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
    }: ReportSkillAssessmentCategoriesPaginationOptionsDto,
    { name }: FindAllReportSkillAssessmentCategoriesDto,
  ) {
    const where: Prisma.ReportSkillAssessmentCategoryWhereInput = {
      name: { contains: name, mode: 'insensitive' },
    };

    const categories = await this.prisma.reportSkillAssessmentCategory.findMany(
      {
        where,
        take: limit,
        skip: calculateSkip(page, limit),
        orderBy: { [sortBy]: sortingOrder },
      },
    );

    const total = await this.prisma.reportSkillAssessmentCategory.count({
      where,
    });

    return formatPaginatedResponse({
      docs: categories,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.reportSkillAssessmentCategory.findMany();
  }

  findOne(id: string) {
    return this.prisma.reportSkillAssessmentCategory.findUnique({
      where: { id },
    });
  }

  update(
    id: string,
    updateReportSkillAssessmentCategoryDto: UpdateReportSkillAssessmentCategoryDto,
  ) {
    return this.prisma.reportSkillAssessmentCategory.update({
      where: { id },
      data: updateReportSkillAssessmentCategoryDto,
    });
  }

  remove(id: string) {
    return this.prisma.reportSkillAssessmentCategory.delete({
      where: { id },
    });
  }
}
