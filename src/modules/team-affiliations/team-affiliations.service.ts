import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamAffiliationDto } from './dto/create-team-affiliation.dto';
import { FindAllTeamAffiliationsDto } from './dto/find-all-team-affiliations.dto';
import { TeamAffiliationsPaginationOptionsDto } from './dto/team-affiliations-pagination-options.dto';
import { UpdateTeamAffiliationDto } from './dto/update-team-affiliation.dto';

const include = Prisma.validator<Prisma.TeamAffiliationInclude>()({
  player: {
    include: {
      country: true,
      primaryPosition: true,
      secondaryPositions: { include: { position: true } },
    },
  },
  team: {
    include: {
      club: true,
      competitions: {
        where: { season: { isActive: true } },
        include: { competition: true, group: true, season: true },
      },
    },
  },
});

@Injectable()
export class TeamAffiliationsService {
  constructor(private readonly prisma: PrismaService) {}

  create({ playerId, teamId, ...rest }: CreateTeamAffiliationDto) {
    return this.prisma.teamAffiliation.create({
      data: {
        player: { connect: { id: playerId } },
        team: { connect: { id: teamId } },
        ...rest,
      },
      include,
    });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: TeamAffiliationsPaginationOptionsDto,
    { playerId, teamId }: FindAllTeamAffiliationsDto,
  ) {
    let sort: Prisma.TeamAffiliationOrderByWithRelationInput;

    switch (sortBy) {
      case 'teamId':
        sort = { team: { name: sortingOrder } };
        break;
      case 'playerId':
        sort = { player: { lastName: sortingOrder } };
      default:
        sort = { [sortBy]: sortingOrder };
    }

    const where: Prisma.TeamAffiliationWhereInput = {
      playerId,
      teamId,
    };

    const affiliations = await this.prisma.teamAffiliation.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include,
    });

    const total = await this.prisma.teamAffiliation.count({ where });

    return formatPaginatedResponse({
      docs: affiliations,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.teamAffiliation.findMany({ include });
  }

  findOne(id: string) {
    return this.prisma.teamAffiliation.findUnique({ where: { id }, include });
  }

  update(id: string, updateTeamAffiliationDto: UpdateTeamAffiliationDto) {
    return this.prisma.teamAffiliation.update({
      where: { id },
      data: updateTeamAffiliationDto,
      include,
    });
  }

  remove(id: string) {
    return this.prisma.teamAffiliation.delete({ where: { id }, include });
  }
}
