import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { calculateSkip, formatPaginatedResponse } from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { FindAllMatchesDto } from './dto/find-all-matches.dto';
import {
  MatchesPaginationOptionsDto,
  MatchesSortByUnion,
} from './dto/matches-pagination-options.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

const include = Prisma.validator<Prisma.MatchInclude>()({
  homeTeam: true,
  awayTeam: true,
  competition: true,
  group: true,
  season: true,
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
    { teamId, competitionIds, groupIds, seasonId }: FindAllMatchesDto,
  ) {
    let sort: Prisma.MatchOrderByWithRelationInput;

    const regularSortBy: MatchesSortByUnion[] = ['date'];

    const relationSortBy: MatchesSortByUnion[] = [
      'homeTeam',
      'awayTeam',
      'competition',
      'group',
      'season',
    ];

    if (regularSortBy.includes(sortBy)) {
      sort = { [sortBy]: sortingOrder };
    }

    if (relationSortBy.includes(sortBy)) {
      sort = { [sortBy]: { name: sortingOrder } };
    }

    if (sortBy === 'competition') {
      sort = {
        competition: { level: sortingOrder },
      };
    }

    if (sortBy === 'season') {
      sort = { season: { endDate: sortingOrder } };
    }

    const where: Prisma.MatchWhereInput = {
      competition: competitionIds ? { id: { in: competitionIds } } : undefined,
      group: groupIds ? { id: { in: groupIds } } : undefined,
      seasonId: seasonId,
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
