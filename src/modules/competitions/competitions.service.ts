import { Injectable } from '@nestjs/common';
import { CompetitionType, Prisma } from '@prisma/client';

import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import {
  CompetitionsPaginationOptionsDto,
  CompetitionsSortByUnion,
} from './dto/competitions-pagination-options.dto';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { FindAllCompetitionsDto } from './dto/find-all-competitions.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { GenderEnum } from './types';

const include: Prisma.CompetitionInclude = {
  country: true,
  ageCategory: true,
  type: true,
  juniorLevel: true,
};

const { ageCategory, type, juniorLevel, ...listInclude } = include;

interface CsvInput {
  id: number;
  name: string;
  gender: GenderEnum;
  level: number;
  transfermarktUrl?: string;
  countryId: string;
  ageCategoryId: string;
  typeId: number;
  juniorLevelId: number;
}

@Injectable()
export class CompetitionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCompetitionDto: CreateCompetitionDto) {
    const { countryId, ageCategoryId, typeId, juniorLevelId, ...rest } =
      createCompetitionDto;

    return this.prisma.competition.create({
      data: {
        ...rest,
        country: { connect: { id: countryId } },
        ageCategory: { connect: { id: ageCategoryId } },
        type: { connect: { id: typeId } },
        juniorLevel: juniorLevelId
          ? { connect: { id: juniorLevelId } }
          : undefined,
      },
      include,
    });
  }

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreateCompetitionDto();
      instance.id = item.id?.toString();
      instance.name = item.name;
      instance.level = item.level;
      instance.gender = item.gender;
      instance.transfermarktUrl = item.transfermarktUrl;
      instance.countryId = item.countryId?.toString();
      instance.typeId = item.typeId?.toString();
      instance.juniorLevelId = item.juniorLevelId?.toString();

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
    { limit, page, sortBy, sortingOrder }: CompetitionsPaginationOptionsDto,
    query: FindAllCompetitionsDto,
  ) {
    let sort: Prisma.CompetitionOrderByWithRelationInput;

    const regularSortBy: CompetitionsSortByUnion[] = [
      'name',
      'level',
      'gender',
    ];

    const relationSortBy: CompetitionsSortByUnion[] = [
      'country',
      'ageCategory',
      'type',
      'juniorLevel',
    ];

    if (regularSortBy.includes(sortBy)) {
      sort = { [sortBy]: sortingOrder };
    }

    if (relationSortBy.includes(sortBy)) {
      sort = { [sortBy]: { name: sortingOrder } };
    }

    const where: Prisma.CompetitionWhereInput = {
      ...query,
    };

    const competitions = await this.prisma.competition.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include,
    });

    const total = await this.prisma.competition.count({ where });

    return formatPaginatedResponse({
      docs: competitions,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.competition.findMany({ include: listInclude });
  }

  findOne(id: string) {
    return this.prisma.competition.findUnique({ where: { id }, include });
  }

  update(id: string, updateCompetitionDto: UpdateCompetitionDto) {
    return this.prisma.competition.update({
      where: { id },
      data: updateCompetitionDto,
      include,
    });
  }

  remove(id: string) {
    return this.prisma.competition.delete({ where: { id }, include });
  }
}
