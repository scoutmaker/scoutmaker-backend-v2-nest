import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import {
  CompetitionsPaginationOptionsDto,
  CompetitionsSortByUnion,
} from './dto/competitions-pagination-options.dto';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { FindAllCompetitionsDto } from './dto/find-all-competitions.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';

const include: Prisma.CompetitionInclude = {
  country: true,
  ageCategory: true,
  type: true,
  juniorLevel: true,
};

const { ageCategory, type, juniorLevel, ...listInclude } = include;

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

  findOne(id: number) {
    return this.prisma.competition.findUnique({ where: { id }, include });
  }

  update(id: number, updateCompetitionDto: UpdateCompetitionDto) {
    return this.prisma.competition.update({
      where: { id },
      data: updateCompetitionDto,
      include,
    });
  }

  remove(id: number) {
    return this.prisma.competition.delete({ where: { id }, include });
  }
}
