import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CompetitionTypesPaginationOptionsDto } from './dto/competition-types-pagination-options.dto';
import { CreateCompetitionTypeDto } from './dto/create-competition-type.dto';
import { FindAllCompetitionTypesDto } from './dto/find-all-competition-types.dto';
import { UpdateCompetitionTypeDto } from './dto/update-competition-type.dto';

@Injectable()
export class CompetitionTypesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCompetitionTypeDto: CreateCompetitionTypeDto) {
    return this.prisma.competitionType.create({
      data: createCompetitionTypeDto,
    });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: CompetitionTypesPaginationOptionsDto,
    { name }: FindAllCompetitionTypesDto,
  ) {
    const where: Prisma.CompetitionTypeWhereInput = {
      name: { contains: name, mode: 'insensitive' },
    };

    const competitionTypes = await this.prisma.competitionType.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: { [sortBy]: sortingOrder },
    });

    const total = await this.prisma.competitionType.count({ where });

    return formatPaginatedResponse({
      docs: competitionTypes,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.competitionType.findMany();
  }

  findOne(id: number) {
    return this.prisma.competitionType.findUnique({ where: { id } });
  }

  update(id: number, updateCompetitionTypeDto: UpdateCompetitionTypeDto) {
    return this.prisma.competitionType.update({
      where: { id },
      data: updateCompetitionTypeDto,
    });
  }

  remove(id: number) {
    return this.prisma.competitionType.delete({ where: { id } });
  }
}
