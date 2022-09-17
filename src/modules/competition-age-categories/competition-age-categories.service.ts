import { Injectable } from '@nestjs/common';
import { CompetitionType, Prisma } from '@prisma/client';

import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CompetitionAgeCategoriesPaginationOptionsDto } from './dto/competition-age-categories-pagination-options.dto';
import { CreateCompetitionAgeCategoryDto } from './dto/create-competition-age-category.dto';
import { FindAllCompetitionAgeCategoriesDto } from './dto/find-all-competition-age-categories.dto';
import { UpdateCompetitionAgeCategoryDto } from './dto/update-competition-age-category.dto';

interface CsvInput {
  id: number;
  name: string;
}

@Injectable()
export class CompetitionAgeCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCompetitionAgeCategoryDto: CreateCompetitionAgeCategoryDto) {
    return this.prisma.competitionAgeCategory.create({
      data: createCompetitionAgeCategoryDto,
    });
  }

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreateCompetitionAgeCategoryDto();
      instance.id = item.id?.toString();
      instance.name = item.name;

      return instance;
    });

    await validateInstances(instances);

    const createdDocuments: CompetitionType[] = [];
    const errors: any[] = [];

    for (const [index, instance] of instances.entries()) {
      try {
        const created = await this.create(instance);
        createdDocuments.push(created);
      } catch (error) {
        errors.push({ index, name: instance.name, error });
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

  findOne(id: string) {
    return this.prisma.competitionAgeCategory.findUnique({ where: { id } });
  }

  update(
    id: string,
    updateCompetitionAgeCategoryDto: UpdateCompetitionAgeCategoryDto,
  ) {
    return this.prisma.competitionAgeCategory.update({
      where: { id },
      data: updateCompetitionAgeCategoryDto,
    });
  }

  remove(id: string) {
    return this.prisma.competitionAgeCategory.delete({ where: { id } });
  }
}
