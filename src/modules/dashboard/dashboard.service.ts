import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { subMonths } from 'date-fns';

import { SortingOrder } from '../../common/pagination/pagination-options.dto';
import { calculatePercentage } from '../../utils/helpers';
import { MatchesService } from '../matches/matches.service';
import { NotesSortBy } from '../notes/dto/notes-pagination-options.dto';
import { NotesService } from '../notes/notes.service';
import { OrganizationSubscriptionsService } from '../organization-subscriptions/organization-subscriptions.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { PlayerDto } from '../players/dto/player.dto';
import { PlayersService } from '../players/players.service';
import { PrismaService } from '../prisma/prisma.service';
import { ReportsSortBy } from '../reports/dto/reports-pagination-options.dto';
import { ReportsService } from '../reports/reports.service';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { UsersService } from '../users/users.service';
import { DashboardDto, DashboardPlayerDto } from './dto/dashboard.dto';
import {
  transformMatchSubscriptions,
  transformObservationSubscriptions,
  transformPlayerSubscriptions,
} from './transform-subscriptions';

type TTopPlayersRaw = {
  playerId: string;
  averagerating: number;
  observations: number;
}[];

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationSubscriptionsService: OrganizationSubscriptionsService,
    private readonly reportsService: ReportsService,
    private readonly notesService: NotesService,
    private readonly matchesService: MatchesService,
    private readonly playersService: PlayersService,
    private readonly usersService: UsersService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  async getData(user: CurrentUserDto) {
    switch (user.role) {
      case 'ADMIN':
      case 'PLAYMAKER_SCOUT_MANAGER':
        return this.getCommonData(user);
      case 'PLAYMAKER_SCOUT':
        return this.getPlaymakerScoutData(user);
      case 'SCOUT':
        if (user.organizationId) return this.getScoutOrganizationData(user);
        return this.getCommonData(user);
    }
  }
  // main helpers

  // PM-ScoutManager | ADMIN | 'SCOUT'
  private async getCommonData(user: CurrentUserDto): Promise<DashboardDto> {
    const monthAgoDate = subMonths(new Date(), 1);

    const rolesScope: UserRole[] =
      user.role === 'SCOUT'
        ? ['SCOUT']
        : ['PLAYMAKER_SCOUT', 'ADMIN', 'PLAYMAKER_SCOUT_MANAGER'];

    const recentScopedObservationsWhere:
      | Prisma.NoteWhereInput
      | Prisma.ReportWhereInput = {
      createdAt: { gte: monthAgoDate },
      author: {
        role: {
          in: rolesScope,
        },
      },
    };

    const recentUserObservationsWhere:
      | Prisma.NoteWhereInput
      | Prisma.ReportWhereInput = {
      createdAt: { gte: monthAgoDate },
      authorId: user.id,
    };

    // reports
    const totalUserReportsPromise = this.reportsService.getCount({
      authorId: user.id,
    });
    const recentUserReportsPromise = this.reportsService.getCount(
      recentUserObservationsWhere,
    );
    const recentScopedReportsPromise = this.reportsService.getCount(
      recentScopedObservationsWhere,
    );

    // notes
    const totalUserNotesPromise = this.notesService.getCount({
      authorId: user.id,
    });
    const recentUserNotesPromise = this.notesService.getCount(
      recentUserObservationsWhere,
    );
    const recentScopedNotesPromise = this.notesService.getCount(
      recentScopedObservationsWhere,
    );

    // matches
    const totalUserMatchesPromise = this.matchesService.getCount({
      OR: [
        { notes: { some: { authorId: user.id } } },
        { reports: { some: { authorId: user.id } } },
      ],
    });

    const recentUserMatchesPromise = this.matchesService.getCount({
      OR: [
        {
          notes: { some: recentUserObservationsWhere },
        },
        {
          reports: { some: recentUserObservationsWhere },
        },
      ],
    });
    const recentScopedMatchesPromise = this.matchesService.getCount({
      OR: [
        { notes: { some: recentScopedObservationsWhere } },
        { reports: { some: recentScopedObservationsWhere } },
      ],
    });

    const [
      totalUserReports,
      recentScopedReports,
      recentUserReports,
      totalUserNotes,
      recentUserNotes,
      recentScopedNotes,
      totalUserMatches,
      recentUserMatches,
      recentScopedMatches,
    ] = await Promise.all([
      totalUserReportsPromise,
      recentScopedReportsPromise,
      recentUserReportsPromise,
      totalUserNotesPromise,
      recentUserNotesPromise,
      recentScopedNotesPromise,
      totalUserMatchesPromise,
      recentUserMatchesPromise,
      recentScopedMatchesPromise,
    ]);

    return {
      reportsCount: totalUserReports,
      recentReportsRatio:
        calculatePercentage(recentUserReports, recentScopedReports) || 0,
      notesCount: totalUserNotes,
      recentNotesRatio:
        calculatePercentage(recentUserNotes, recentScopedNotes) || 0,
      observedMatchesCount: totalUserMatches,
      recentObservedMatchesRatio:
        calculatePercentage(recentUserMatches, recentScopedMatches) || 0,
    };
  }

  // PlayMaker-Scout
  private async getPlaymakerScoutData(
    user: CurrentUserDto,
  ): Promise<DashboardDto> {
    const [data, organizations] = await Promise.all([
      this.getCommonData(user),
      this.organizationsService.getList({
        subscriptions: { some: { endDate: { gte: new Date() } } },
      }),
    ]);

    return { ...data, organizations };
  }

  private async getScoutOrganizationData(
    user: CurrentUserDto,
  ): Promise<DashboardDto> {
    // get subscriptions filters
    const { subscribedMatches, subscribedObservations, subscribedPlayers } =
      await this.getOrganizaitonSubscriptionsFilters(user.organizationId);

    // get data
    const scoutsCountPromise = this.usersService.getCount({
      OR: [
        {
          createdNotes: {
            some: subscribedObservations,
          },
        },
        {
          createdReports: {
            some: subscribedObservations,
          },
        },
      ],
    });

    const playersCountPromise = this.playersService.getCount({
      AND: [
        { OR: [{ notes: { some: {} } }, { reports: { some: {} } }] },
        subscribedPlayers,
      ],
    });

    const matchesCountPromise = this.matchesService.getCount({});
    const observedMatchesCountPromise = this.matchesService.getCount({
      AND: [
        { OR: [{ notes: { some: {} } }, { reports: { some: {} } }] },
        subscribedMatches,
      ],
    });

    const topNotesPromise = this.getTopNotes(subscribedObservations);
    const topReportsPromise = this.getTopReports(subscribedObservations);

    const notesCountPromise = this.notesService.getCount(
      subscribedObservations,
    );
    const reportsCountPromise = this.reportsService.getCount(
      subscribedObservations,
    );

    const [
      scoutsCount,
      playersCount,
      observedMatchesCount,
      topNotes,
      topReports,
      notesCount,
      reportsCount,
      matchesCount,
      topPlayers,
    ] = await Promise.all([
      scoutsCountPromise,
      playersCountPromise,
      observedMatchesCountPromise,
      topNotesPromise,
      topReportsPromise,
      notesCountPromise,
      reportsCountPromise,
      matchesCountPromise,
      this.getTopPlayers(),
    ]);

    return {
      scoutsCount,
      observerdPlayersCount: playersCount,
      observedMatchesCount,
      topNotes: topNotes.docs,
      topReports: topReports.docs,
      notesCount,
      reportsCount,
      matchesCount,
      topPlayers,
    };
  }
  // helpers

  private getTopNotes(filters: Prisma.NoteWhereInput) {
    return this.notesService.findAll(
      {
        limit: 5,
        sortBy: NotesSortBy.createdAt,
        sortingOrder: SortingOrder.desc,
      },
      { percentageRatingRangeStart: 75 },
      undefined,
      filters,
    );
  }

  private getTopReports(filters: Prisma.ReportWhereInput) {
    return this.reportsService.findAll(
      {
        limit: 5,
        sortBy: ReportsSortBy.createdAt,
        sortingOrder: SortingOrder.desc,
      },
      { percentageRatingRangeStart: 75 },
      undefined,
      filters,
    );
  }

  private async getOrganizaitonSubscriptionsFilters(organizationId: string) {
    const organizationSubscriptions =
      await this.organizationSubscriptionsService.getFormattedForSingleOrganization(
        organizationId,
      );

    // transform subscriptions to filters
    const subscribedObservations = transformObservationSubscriptions(
      organizationSubscriptions,
    );
    const subscribedPlayers = transformPlayerSubscriptions(
      organizationSubscriptions,
    );
    const subscribedMatches = transformMatchSubscriptions(
      organizationSubscriptions,
    );

    return { subscribedObservations, subscribedPlayers, subscribedMatches };
  }

  private async getTopPlayers(): Promise<DashboardDto['topPlayers']> {
    const topPlayersRaw = await this.prisma
      .$queryRaw<TTopPlayersRaw>`SELECT "r"."playerId", avg(r.rating) as averageRating, count(r.rating) as observations from (select "playerId", "percentageRating" as rating from "Report" union all select "playerId", "percentageRating" as rating from "Note") r group by "r"."playerId" having count(r.rating) >= 3 order by 2 desc FETCH FIRST 5 ROWS ONLY`;

    const topPlayersWithIncludedData: DashboardPlayerDto[] = await Promise.all(
      topPlayersRaw.map((entry) => this.playersService.findOne(entry.playerId)),
    );

    return topPlayersWithIncludedData.map((player) => ({
      ...player,
      averagePrecentageRating: topPlayersRaw.find(
        (e) => e.playerId === player.id,
      ).averagerating,
    }));
  }
}
