import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCompetitionGroupDto } from './dto/create-competition-group.dto';
import { UpdateCompetitionGroupDto } from './dto/update-competition-group.dto';

const include: Prisma.CompetitionGroupInclude = {
  competition: true,
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

  findAll() {
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

  async remove(id: string) {
    // Remove all existing RegionsOnCompetitionGroups records
    await this.prisma.regionsOnCompetitionGroups.deleteMany({
      where: { groupId: id },
    });

    return this.prisma.competitionGroup.delete({ where: { id }, include });
  }
}
