import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import {
  calculateSkip,
  formatPaginatedResponse,
  isIdsArrayFilterDefined,
} from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { FindAllMatchesDto } from './dto/find-all-matches.dto';
import { MatchesPaginationOptionsDto } from './dto/matches-pagination-options.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

const include = Prisma.validator<Prisma.MatchInclude>()({
  homeTeam: true,
  awayTeam: true,
  competition: true,
  group: true,
  season: true,
  _count: { select: { notes: true, reports: true } },
});

const { group, season, ...listInclude } = include;

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMatchDto: CreateMatchDto, authorId: string) {
    const {
      homeTeamId,
      awayTeamId,
      competitionId,
      groupId,
      seasonId,
      ...rest
    } = createMatchDto;

    return this.prisma.match.create({
      data: {
        ...rest,
        homeTeam: { connect: { id: homeTeamId } },
        awayTeam: { connect: { id: awayTeamId } },
        competition: { connect: { id: competitionId } },
        group: groupId ? { connect: { id: groupId } } : undefined,
        season: { connect: { id: seasonId } },
        author: { connect: { id: authorId } },
      },
      include,
    });
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: MatchesPaginationOptionsDto,
    { teamId, competitionIds, groupIds, seasonId, hasVideo }: FindAllMatchesDto,
  ) {
    let sort: Prisma.MatchOrderByWithRelationInput;

    switch (sortBy) {
      case 'date':
      case 'videoUrl':
        sort = { [sortBy]: sortingOrder };
        break;

      case 'homeTeam':
      case 'awayTeam':
      case 'group':
      case 'season':
        sort = { [sortBy]: { name: sortingOrder } };
        break;

      case 'competition':
        sort = {
          competition: { level: sortingOrder },
        };
        break;

      case 'season':
        sort = { season: { endDate: sortingOrder } };
        break;

      case 'reportsCount':
        sort = { reports: { _count: sortingOrder } };
        break;

      case 'notesCount':
        sort = { notes: { _count: sortingOrder } };
        break;

      default:
        sort = { [sortBy]: sortingOrder };
        break;
    }

    const where: Prisma.MatchWhereInput = {
      competition: isIdsArrayFilterDefined(competitionIds)
        ? { id: { in: competitionIds } }
        : undefined,
      group: isIdsArrayFilterDefined(groupIds)
        ? { id: { in: groupIds } }
        : undefined,
      seasonId,
      videoUrl: hasVideo ? { not: null } : undefined,
      AND: teamId
        ? [
            {
              OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
            },
          ]
        : undefined,
    };

    const matches = await this.prisma.match.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include,
    });

    const total = await this.prisma.match.count({ where });

    return formatPaginatedResponse({
      docs: matches,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList() {
    return this.prisma.match.findMany({ include: listInclude });
  }

  findOne(id: string) {
    return this.prisma.match.findUnique({ where: { id }, include });
  }

  update(id: string, updateMatchDto: UpdateMatchDto) {
    return this.prisma.match.update({
      where: { id },
      data: updateMatchDto,
      include,
    });
  }

  remove(id: string) {
    return this.prisma.match.delete({ where: { id }, include });
  }
}
