import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { subMonths } from 'date-fns';

import { calculatePercentage } from '../../utils/helpers';
import { MatchesService } from '../matches/matches.service';
import { NotesService } from '../notes/notes.service';
import { OrganizationSubscriptionsService } from '../organization-subscriptions/organization-subscriptions.service';
import { PlayersService } from '../players/players.service';
import { PrismaService } from '../prisma/prisma.service';
import { ReportsService } from '../reports/reports.service';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { UsersService } from '../users/users.service';
import { DashboardDto } from './dto/dashboard.dto';
import {
  transformMatchSubscriptions,
  transformObservationSubscriptions,
  transformPlayerSubscriptions,
} from './transform-subscriptions';

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
  ) {}

  // PM-ScoutManager | ADMIN | 'SCOUT'
  private async getCommonData(user: CurrentUserDto) {
    const getMatchesCount = (filters: Prisma.MatchWhereInput) =>
      this.matchesService.getCount({ accessFilters: filters });
    const getReportsCount = (filters: Prisma.ReportWhereInput) =>
      this.reportsService.getCount({ accessFilters: filters });
    const getNotesCount = (filters: Prisma.NoteWhereInput) =>
      this.notesService.getCount(filters);

    const data: DashboardDto = { user };

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
    const totalUserReportsPromise = getReportsCount({
      authorId: user.id,
    });
    const recentUserReportsPromise = getReportsCount(
      recentUserObservationsWhere,
    );
    const recentScopedReportsPromise = getReportsCount(
      recentScopedObservationsWhere,
    );

    // notes
    const totalUserNotesPromise = getNotesCount({ authorId: user.id });
    const recentUserNotesPromise = getNotesCount(recentUserObservationsWhere);
    const recentScopedNotesPromise = getNotesCount(
      recentScopedObservationsWhere,
    );

    // matches
    const totalUserMatchesPromise = getMatchesCount({
      OR: [
        { notes: { some: { authorId: user.id } } },
        { reports: { some: { authorId: user.id } } },
      ],
    });

    const recentUserMatchesPromise = getMatchesCount({
      OR: [
        {
          notes: { some: recentUserObservationsWhere },
        },
        {
          reports: { some: recentUserObservationsWhere },
        },
      ],
    });
    const recentScopedMatchesPromise = getMatchesCount({
      OR: [
        { notes: { some: recentScopedObservationsWhere } },
        { reports: { some: recentScopedObservationsWhere } },
      ],
    });

    const [
      totalUserReports,
      recentScopedReports,
      recentUserReports,
      //
      totalUserNotes,
      recentUserNotes,
      recentScopedNotes,
      //
      totalUserMatches,
      recentUserMatches,
      recentScopedMatches,
    ] = await Promise.all([
      totalUserReportsPromise,
      recentScopedReportsPromise,
      recentUserReportsPromise,
      //
      totalUserNotesPromise,
      recentUserNotesPromise,
      recentScopedNotesPromise,
      //
      totalUserMatchesPromise,
      recentUserMatchesPromise,
      recentScopedMatchesPromise,
    ]);

    // include data
    data.reportsCount = totalUserReports;
    data.recentReportsRatio =
      calculatePercentage(recentUserReports, recentScopedReports) || 0;

    data.notesCount = totalUserNotes;
    data.recentNotesRatio =
      calculatePercentage(recentUserNotes, recentScopedNotes) || 0;

    data.observedMatchesCount = totalUserMatches;
    data.recentObservedMatchesRatio =
      calculatePercentage(recentUserMatches, recentScopedMatches) || 0;

    return data;
  }

  // PlayMaker-Scout
  private async getPlaymakerScoutData(user: CurrentUserDto) {
    const [data, sharedAclOrganizations] = await Promise.all([
      this.getCommonData(user),
      this.prisma.organization.findMany({
        where: {
          OR: [
            {
              noteAccessControlList: { some: { note: { authorId: user.id } } },
            },
            {
              reportAccessControlList: {
                some: { report: { authorId: user.id } },
              },
            },
          ],
        },
        include: {
          noteAccessControlList: {
            include: { note: true },
            where: { note: { authorId: user.id } },
          },
          reportAccessControlList: {
            include: { report: true },
            where: { report: { authorId: user.id } },
          },
        },
      }),
    ]);

    // Missing matches shared with subscriptions
    data.organizations = sharedAclOrganizations.map((org) => {
      const observedMatchesIds = new Set<string>();

      org.noteAccessControlList.forEach((noteAce) => {
        if (noteAce.note.matchId) observedMatchesIds.add(noteAce.note.matchId);
      });
      org.reportAccessControlList.forEach((reportAce) => {
        if (reportAce.report.matchId)
          observedMatchesIds.add(reportAce.report.matchId);
      });
      return { name: org.name, sharedMatchesCount: observedMatchesIds.size };
    });

    return data;
  }

  private async getScoutOrganizationData(user: CurrentUserDto) {
    const data: DashboardDto = { user };
    const organizationSubscriptions =
      await this.organizationSubscriptionsService.getFormattedForSingleOrganization(
        user.organizationId,
      );

    // get subscriptions filters
    const observationsSubscribed = transformObservationSubscriptions(
      organizationSubscriptions,
    );
    const playersSubscribed = transformPlayerSubscriptions(
      organizationSubscriptions,
    );
    const matchesSubscribed = transformMatchSubscriptions(
      organizationSubscriptions,
    );

    // get data
    const scoutsCountPromise = this.usersService.getCount({
      OR: [
        {
          createdNotes: {
            some: observationsSubscribed,
          },
        },
        {
          createdReports: {
            some: observationsSubscribed,
          },
        },
      ],
    });

    const playersCountPromise = this.playersService.getCount({
      accessFilters: {
        AND: [
          { OR: [{ notes: { some: {} } }, { reports: { some: {} } }] },
          playersSubscribed,
        ],
      },
    });

    const matchesCountPromise = this.matchesService.getCount({
      accessFilters: {
        AND: [
          { OR: [{ notes: { some: {} } }, { reports: { some: {} } }] },
          matchesSubscribed,
        ],
      },
    });

    const topNotesPromise = this.prisma.note.findMany({
      where: {
        AND: [{ percentageRating: { gte: 75 } }, observationsSubscribed],
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        player: true,
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
            competition: { include: { country: true } },
          },
        },
      },
    });

    const topReportsPromise = this.prisma.report.findMany({
      where: {
        AND: [{ percentageRating: { gte: 75 } }, observationsSubscribed],
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        player: true,
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
            competition: { include: { country: true } },
          },
        },
      },
    });

    const [scoutsCount, playersCount, matchesCount, topNotes, topReports] =
      await Promise.all([
        scoutsCountPromise,
        playersCountPromise,
        matchesCountPromise,
        topNotesPromise,
        topReportsPromise,
      ]);

    // include data
    data.scoutsCount = scoutsCount;
    data.observerdPlayersCount = playersCount;
    data.observedMatchesCount = matchesCount;

    data.topNotes = topNotes;
    data.topReports = topReports;

    return data;
  }

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
}
