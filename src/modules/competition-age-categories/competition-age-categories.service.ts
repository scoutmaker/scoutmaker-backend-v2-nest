import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CompetitionAgeCategoriesPaginationOptionsDto } from './dto/competition-age-categories-pagination-options.dto';
import { CreateCompetitionAgeCategoryDto } from './dto/create-competition-age-category.dto';
import { FindAllCompetitionAgeCategoriesDto } from './dto/find-all-competition-age-categories.dto';
import { UpdateCompetitionAgeCategoryDto } from './dto/update-competition-age-category.dto';

@Injectable()
export class CompetitionAgeCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCompetitionAgeCategoryDto: CreateCompetitionAgeCategoryDto) {
    return this.prisma.competitionAgeCategory.create({
      data: createCompetitionAgeCategoryDto,
    });
  }

  async findAll(
    {
      limit,
      page,
      sortBy,
      sortingOrder,
    }: CompetitionAgeCategoriesPaginationOptionsDto,
    { name }: FindAllCompetitionAgeCategoriesDto,
  ) {
    const where: Prisma.CompetitionAgeCategoryWhereInput = {
      name: { contains: name, mode: 'insensitive' },
    };

    const categories = await this.prisma.competitionAgeCategory.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: { [sortBy]: sortingOrder },
    });

    const total = await this.prisma.competitionAgeCategory.count({ where });

    return formatPaginatedResponse({
      docs: categories,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.competitionAgeCategory.findMany();
  }

  findOne(id: number) {
    return this.prisma.competitionAgeCategory.findUnique({ where: { id } });
  }

  update(
    id: number,
    updateCompetitionAgeCategoryDto: UpdateCompetitionAgeCategoryDto,
  ) {
    return this.prisma.competitionAgeCategory.update({
      where: { id },
      data: updateCompetitionAgeCategoryDto,
    });
  }

  remove(id: number) {
    return this.prisma.competitionAgeCategory.delete({ where: { id } });
  }
}
