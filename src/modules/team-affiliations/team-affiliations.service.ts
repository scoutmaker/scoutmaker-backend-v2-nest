import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamAffiliationDto } from './dto/create-team-affiliation.dto';
import { UpdateTeamAffiliationDto } from './dto/update-team-affiliation.dto';

const include: Prisma.TeamAffiliationInclude = {
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
};

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

  findAll() {
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
