import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import {
  calculateSkip,
  formatPaginatedResponse,
  isIdsArrayFilterDefined,
} from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CompetitionGroupsPaginationOptionsDto } from './dto/competition-groups-pagination-options.dto';
import { CreateCompetitionGroupDto } from './dto/create-competition-group.dto';
import { FindAllCompetitionGroupsDto } from './dto/find-all-competition-groups.dto';
import { UpdateCompetitionGroupDto } from './dto/update-competition-group.dto';

const include: Prisma.CompetitionGroupInclude = {
  competition: { include: { country: true } },
  regions: { include: { region: true } },
};

@Injectable()
export class CompetitionGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCompetitionGroupDto: CreateCompetitionGroupDto) {
    const { regionIds, ...rest } = createCompetitionGroupDto;
    return this.prisma.competitionGroup.create({
      data: {
        ...rest,
        regions: {
          createMany: { data: regionIds.map((id) => ({ regionId: id })) },
        },
      },
      include,
    });
  }

  async findAll(
    {
      limit,
      page,
      sortBy,
      sortingOrder,
    }: CompetitionGroupsPaginationOptionsDto,
    { name, competitionIds, regionIds }: FindAllCompetitionGroupsDto,
  ) {
    const where: Prisma.CompetitionGroupWhereInput = {
      name: { contains: name, mode: 'insensitive' },
      competitionId: isIdsArrayFilterDefined(competitionIds)
        ? { in: competitionIds }
        : undefined,
      regions: isIdsArrayFilterDefined(regionIds)
        ? { some: { region: { id: { in: regionIds } } } }
        : undefined,
    };

    const competitionGroups = await this.prisma.competitionGroup.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: { [sortBy]: sortingOrder },
      include,
    });

    const total = await this.prisma.competitionGroup.count({ where });

    return formatPaginatedResponse({
      docs: competitionGroups,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.competitionGroup.findMany({ include });
  }

  findOne(id: number) {
    return this.prisma.competitionGroup.findUnique({ where: { id }, include });
  }

  async update(
    id: number,
    updateCompetitionGroupDto: UpdateCompetitionGroupDto,
  ) {
    const { regionIds, ...rest } = updateCompetitionGroupDto;

    // If user wants to update group regions, first we need to delete all existing RegionsOnCompetitionGroups records
    if (regionIds && regionIds.length !== 0) {
      await this.prisma.regionsOnCompetitionGroups.deleteMany({
        where: { groupId: id },
      });
    }

    return this.prisma.competitionGroup.update({
      where: { id },
      data: {
        ...rest,
        regions: {
          createMany: regionIds
            ? { data: regionIds.map((id) => ({ regionId: id })) }
            : undefined,
        },
      },
      include,
    });
  }

  async remove(id: number) {
    // Remove all existing RegionsOnCompetitionGroups records
    await this.prisma.regionsOnCompetitionGroups.deleteMany({
      where: { groupId: id },
    });

    return this.prisma.competitionGroup.delete({ where: { id }, include });
  }
}
