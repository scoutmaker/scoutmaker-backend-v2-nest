import { Injectable } from '@nestjs/common';
import { Match, ObservationType, Prisma } from '@prisma/client';

import { parseCsv, validateInstances } from '../../utils/csv-helpers';
import {
  calculateSkip,
  formatPaginatedResponse,
  isIdsArrayFilterDefined,
} from '../../utils/helpers';
import { PrismaService } from '../prisma/prisma.service';
import { TeamAffiliationsService } from '../team-affiliations/team-affiliations.service';
import { TeamsService } from '../teams/teams.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { FindAllMatchesDto } from './dto/find-all-matches.dto';
import { MatchesPaginationOptionsDto } from './dto/matches-pagination-options.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

interface CsvInput {
  id: number;
  date: string;
  homeGoals?: number;
  awayGoals?: number;
  videoUrl?: string;
  homeTeamId: number;
  awayTeamId: number;
  competitionId: number;
  groupId?: number;
  seasonId: number;
  authorId: number;
}

type ObservationTypeOnly = { observationType: ObservationType }[];

const include = Prisma.validator<Prisma.MatchInclude>()({
  homeTeam: true,
  awayTeam: true,
  competition: true,
  group: true,
  season: true,
  author: true,
  _count: { select: { notes: true, reports: true } },
});

const observationTypeInclude = Prisma.validator<Prisma.MatchInclude>()({
  ...include,
  notes: { select: { observationType: true } },
  reports: { select: { observationType: true } },
});

const { group, season, ...listInclude } = include;

@Injectable()
export class MatchesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly teamAffiliationsService: TeamAffiliationsService,
    private readonly teamsService: TeamsService,
  ) {}

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

  async createManyFromCsv(file: Express.Multer.File) {
    const result = parseCsv<CsvInput>(file.buffer.toString());

    const instances = result.data.map((item) => {
      const instance = new CreateMatchDto();

      instance.id = item.id?.toString();
      instance.date = item.date;
      instance.homeGoals = item.homeGoals;
      instance.awayGoals = item.awayGoals;
      instance.videoUrl = item.videoUrl;
      instance.homeTeamId = item.homeTeamId?.toString();
      instance.awayTeamId = item.awayTeamId?.toString();
      instance.competitionId = item.competitionId?.toString();
      instance.groupId = item.groupId?.toString();
      instance.seasonId = item.seasonId?.toString();

      return instance;
    });

    await validateInstances(instances);

    const createdDocuments: Match[] = [];
    const errors: any[] = [];

    for (const [index, instance] of instances.entries()) {
      try {
        const created = await this.create(
          instance,
          result.data[index].authorId.toString(),
        );
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

  private generateWhereClause({
    competitionIds,
    groupIds,
    hasVideo,
    seasonId,
    orderId,
    teamId,
  }: FindAllMatchesDto): Prisma.MatchWhereInput {
    return {
      competition: isIdsArrayFilterDefined(competitionIds)
        ? { id: { in: competitionIds } }
        : undefined,
      group: isIdsArrayFilterDefined(groupIds)
        ? { id: { in: groupIds } }
        : undefined,
      seasonId,
      orders: orderId ? { some: { id: orderId } } : undefined,
      videoUrl: hasVideo ? { not: null } : undefined,
      AND: teamId
        ? [
            {
              OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
            },
          ]
        : undefined,
    };
  }

  private fillObservationType<
    T extends { notes: ObservationTypeOnly; reports: ObservationTypeOnly },
  >(match: T): T & { observationType: ObservationType | 'BOTH' } {
    if (!match.notes.length && !match.reports.length) {
      return { ...match, observationType: null };
    }

    const isVideo =
      match.notes.some((note) => note.observationType === 'VIDEO') ||
      match.reports.some((report) => report.observationType === 'VIDEO');

    const isLive =
      match.notes.some((note) => note.observationType === 'LIVE') ||
      match.reports.some((report) => report.observationType === 'LIVE');

    let observationType: ObservationType | 'BOTH' = null;
    if (isVideo && isLive) observationType = 'BOTH';
    else if (isLive) observationType = 'LIVE';
    else if (isVideo) observationType = 'VIDEO';

    return { ...match, observationType };
  }

  async findAll(
    { limit, page, sortBy, sortingOrder }: MatchesPaginationOptionsDto,
    query: FindAllMatchesDto,
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

    const where = this.generateWhereClause(query);

    const matches = await this.prisma.match.findMany({
      where,
      take: limit,
      skip: calculateSkip(page, limit),
      orderBy: sort,
      include: observationTypeInclude,
    });
    const total = await this.prisma.match.count({ where });

    const finalMatches = matches.map(this.fillObservationType);
    return formatPaginatedResponse({
      docs: finalMatches,
      totalDocs: total,
      limit,
      page,
    });
  }

  getList(query: FindAllMatchesDto) {
    return this.prisma.match.findMany({
      where: this.generateWhereClause(query),
      orderBy: { date: 'desc' },
      include: listInclude,
    });
  }

  async findOne(id: string) {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: observationTypeInclude,
    });
    return this.fillObservationType(match);
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

  getCount(filters: Prisma.MatchWhereInput) {
    return this.prisma.match.count({
      where: filters,
    });
  }

  async getPlayerTeamInMatch(playerId: string, matchId: string) {
    const match = await this.findOne(matchId);

    const { docs: aff } = await this.teamAffiliationsService.findAll(
      {},
      { clubIds: [match.homeTeam.clubId, match.awayTeam.clubId], playerId },
    );
    if (
      aff.some((e) => e.team.clubId === match.homeTeam.clubId) &&
      aff.every((e) => e.team.clubId !== match.awayTeam.clubId)
    ) {
      return { team: await this.teamsService.findOne(match.homeTeamId) };
    }
    if (
      aff.some((e) => e.team.clubId === match.awayTeam.clubId) &&
      aff.every((e) => e.team.clubId !== match.homeTeam.clubId)
    ) {
      return { team: await this.teamsService.findOne(match.awayTeamId) };
    }
    if (aff.length >= 2) {
      const matchDate = new Date(match.date);

      const inDate = aff.filter(
        (e) =>
          (!e.endDate || new Date(e.endDate) >= matchDate) &&
          new Date(e.startDate) <= matchDate,
      );
      if (inDate.length === 1) {
        if (inDate[0].team.clubId === match.homeTeam.clubId)
          return { team: await this.teamsService.findOne(match.homeTeamId) };
        if (inDate[0].team.clubId === match.awayTeam.clubId)
          return { team: await this.teamsService.findOne(match.awayTeamId) };
      }
    }
    return {
      team: await this.teamsService.findOne(match.homeTeamId),
      notMatched: true,
    };
  }
}
