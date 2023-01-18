import { Injectable } from '@nestjs/common';
import { Prisma, TeamAffiliation } from '@prisma/client';

import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PlayersService } from '../players/players.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamAffiliationDto } from './dto/create-team-affiliation.dto';
import { FindAllTeamAffiliationsDto } from './dto/find-all-team-affiliations.dto';
import { TeamAffiliationsPaginationOptionsDto } from './dto/team-affiliations-pagination-options.dto';
import { UpdateTeamAffiliationDto } from './dto/update-team-affiliation.dto';

interface CsvInput {
  id: number;
  startDate: string;
  endDate: string;
  playerId: number;
  teamId: number;
}

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly playersService: PlayersService,
  ) {}

  async create({
    playerId,
    teamId,
    startDate,
    endDate,
    ...rest
  }: CreateTeamAffiliationDto) {
    const created = await this.prisma.teamAffiliation.create({
      data: {
        player: { connect: { id: playerId } },
        team: { connect: { id: teamId } },
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        ...rest,
      },
      include,
    });
    this.playersService.deleteFromCache(created.player.slug);
    this.playersService.deleteFromCache(created.player.id);
    return created;
  }

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreateTeamAffiliationDto();

      instance.id = item.id?.toString();
      instance.startDate = item.startDate;
      instance.endDate = item.endDate;
      instance.playerId = item.playerId?.toString();
      instance.teamId = item.teamId?.toString();

      return instance;
    });

    await validateInstances(instances);

    const createdDocuments: TeamAffiliation[] = [];
    const errors: any[] = [];

    for (const [index, instance] of instances.entries()) {
      try {
        const created = await this.create(instance);
        createdDocuments.push(created);
      } catch (error) {
        errors.push({ index, name: instance.id, error });
      }
    }

    return {
      csvRowsCount: result.data.length,
      createdCount: createdDocuments.length,
      errors,
    };
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

  async update(id: string, { endDate, startDate }: UpdateTeamAffiliationDto) {
    let endDateFinal = undefined;

    if (endDate === null) endDateFinal = null;
    else if (endDate) endDateFinal = new Date(endDate);

    const updated = await this.prisma.teamAffiliation.update({
      where: { id },
      data: {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDateFinal,
      },
      include,
    });
    this.playersService.deleteFromCache(updated.player.slug);
    this.playersService.deleteFromCache(updated.player.id);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.prisma.teamAffiliation.delete({
      where: { id },
      include,
    });
    this.playersService.deleteFromCache(deleted.player.slug);
    this.playersService.deleteFromCache(deleted.player.id);
    return deleted;
  }
}
