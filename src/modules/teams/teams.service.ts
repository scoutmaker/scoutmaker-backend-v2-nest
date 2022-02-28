import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { FindAllTeamsDto } from './dto/find-all-teams.dto';
import { TeamsPaginationOptionsDto } from './dto/teams-pagination-options.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

const include: Prisma.TeamInclude = {
  club: true,
  competitions: {
    where: { season: { isActive: true } },
    include: { competition: true, group: true, season: true },
  },
};
@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTeamDto: CreateTeamDto, authorId: string) {
    const { clubId, competitionId, groupId, ...rest } = createTeamDto;

    return this.prisma.team.create({
      data: {
        ...rest,
        club: { connect: { id: clubId } },
        author: { connect: { id: authorId } },
        competitions: {
          create: {
            competition: { connect: { id: competitionId } },
            group: groupId ? { connect: { id: groupId } } : undefined,
            season: { connect: { isActive: true } },
          },
        },
      },
      include,
    });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: TeamsPaginationOptionsDto,
    { name, clubId, regionId, countryId }: FindAllTeamsDto,
  ) {
    let sort: Prisma.TeamOrderByWithRelationInput;

    switch (sortBy) {
      case 'name':
        sort = { name: sortingOrder };
        break;
      case 'clubId':
        sort = { club: { name: sortingOrder } };
        break;
      case 'regionId':
        sort = { club: { region: { name: sortingOrder } } };
        break;
      case 'countryId':
        sort = { club: { country: { name: sortingOrder } } };
        break;
      default:
        sort = undefined;
        break;
    }

    const where: Prisma.TeamWhereInput = {
      name,
      clubId,
      club:
        regionId || countryId
          ? { region: { id: regionId }, country: { id: countryId } }
          : undefined,
    };

    const teams = await this.prisma.team.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include,
    });

    const total = await this.prisma.team.count({ where });

    return formatPaginatedResponse({
      docs: teams,
      totalDocs: total,
      limit,
      page,
    });
  }

  findOne(id: string) {
    return this.prisma.team.findUnique({ where: { id }, include });
  }

  update(id: string, updateTeamDto: UpdateTeamDto) {
    return this.prisma.team.update({
      where: { id },
      data: updateTeamDto,
      include,
    });
  }

  remove(id: string) {
    return this.prisma.team.delete({ where: { id }, include });
  }
}
