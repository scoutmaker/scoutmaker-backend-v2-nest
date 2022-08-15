import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CompetitionJuniorLevelsPaginationOptionsDto } from './dto/competition-junior-levels-pagination-options.dto';
import { CreateCompetitionJuniorLevelDto } from './dto/create-competition-junior-level.dto';
import { FindAllCompetitionJuniorLevelsDto } from './dto/find-all-competition-junior-levels.dto';
import { UpdateCompetitionJuniorLevelDto } from './dto/update-competition-junior-level.dto';

@Injectable()
export class CompetitionJuniorLevelsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCompetitionJuniorLevelDto: CreateCompetitionJuniorLevelDto) {
    return this.prisma.competitionJuniorLevel.create({
      data: createCompetitionJuniorLevelDto,
    });
  }

  async findAll(
    {
      limit,
      page,
      sortBy,
      sortingOrder,
    }: CompetitionJuniorLevelsPaginationOptionsDto,
    { name, level }: FindAllCompetitionJuniorLevelsDto,
  ) {
    const where: Prisma.CompetitionJuniorLevelWhereInput = {
      name: { contains: name, mode: 'insensitive' },
      level,
    };

    const competitionJuniorLevels =
      await this.prisma.competitionJuniorLevel.findMany({
        where,
        take: limit,
        skip: calculateSkip(page, limit),
        orderBy: { [sortBy]: sortingOrder },
      });

    const total = await this.prisma.competitionJuniorLevel.count({ where });

    return formatPaginatedResponse({
      docs: competitionJuniorLevels,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.competitionJuniorLevel.findMany();
  }

  findOne(id: number) {
    return this.prisma.competitionJuniorLevel.findUnique({ where: { id } });
  }

  update(
    id: number,
    updateCompetitionJuniorLevelDto: UpdateCompetitionJuniorLevelDto,
  ) {
    return this.prisma.competitionJuniorLevel.update({
      where: { id },
      data: updateCompetitionJuniorLevelDto,
    });
  }

  remove(id: number) {
    return this.prisma.competitionJuniorLevel.delete({ where: { id } });
  }
}
