import { Injectable } from '@nestjs/common';
import { CompetitionType, Prisma } from '@prisma/client';

import { parseCsv, validateInstances } from '../../utils/csv-helpers';
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

interface CsvInput {
  id: number;
  name: string;
  transfermarktUrl?: string;
  competitionId: number;
  regionIds?: string;
}

@Injectable()
export class CompetitionGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCompetitionGroupDto: CreateCompetitionGroupDto) {
    const { regionIds, ...rest } = createCompetitionGroupDto;
    return this.prisma.competitionGroup.create({
      data: {
        ...rest,
        regions:
          regionIds && regionIds.length > 0
            ? {
                createMany: { data: regionIds.map((id) => ({ regionId: id })) },
              }
            : undefined,
      },
      include,
    });
  }

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreateCompetitionGroupDto();

      instance.id = item.id?.toString();
      instance.name = item.name;
      instance.transfermarktUrl = item.transfermarktUrl;
      instance.competitionId = item.competitionId?.toString();
      instance.regionIds = item.regionIds?.split(',');

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

  findOne(id: string) {
    return this.prisma.competitionGroup.findUnique({ where: { id }, include });
  }

  async update(
    id: string,
    updateCompetitionGroupDto: UpdateCompetitionGroupDto,
  ) {
    const { regionIds, ...rest } = updateCompetitionGroupDto;

    // If user wants to update group regions, first we need to delete all existing RegionsOnCompetitionGroups records
    if (regionIds) {
      await this.prisma.regionsOnCompetitionGroups.deleteMany({
        where: { groupId: id },
      });
    }

    return this.prisma.competitionGroup.update({
      where: { id },
      data: {
        ...rest,
        regions: {
          createMany:
            regionIds && regionIds.length > 0
              ? { data: regionIds.map((id) => ({ regionId: id })) }
              : undefined,
        },
      },
      include,
    });
  }

  async remove(id: string) {
    // Remove all existing RegionsOnCompetitionGroups records
    await this.prisma.regionsOnCompetitionGroups.deleteMany({
      where: { groupId: id },
    });

    return this.prisma.competitionGroup.delete({ where: { id }, include });
  }
}
