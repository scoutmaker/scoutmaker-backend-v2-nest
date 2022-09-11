import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportSkillAssessmentCategoryDto } from './dto/create-report-skill-assessment-category.dto';
import { FindAllReportSkillAssessmentCategoriesDto } from './dto/find-all-report-skill-assessment-categories.dto';
import { ReportSkillAssessmentCategoriesPaginationOptionsDto } from './dto/report-skill-assessment-categories-pagination-options.dto';
import { UpdateReportSkillAssessmentCategoryDto } from './dto/update-report-skill-assessment-category.dto';

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
