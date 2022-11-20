import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { subMonths } from 'date-fns';

import { calculatePercentage } from '../../utils/helpers';
import { OrganizationSubscriptionsService } from '../organization-subscriptions/organization-subscriptions.service';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserDto } from '../users/dto/current-user.dto';
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
  ) {}

  // PM-ScoutManager | ADMIN | 'SCOUT'
  private async getScoutData(user: CurrentUserDto) {
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
    const totalUserReportsPromise = this.prisma.report.count({
      where: { authorId: user.id },
    });
    const recentUserReportsPromise = this.prisma.report.count({
      where: recentUserObservationsWhere,
    });
    const recentScopedReportsPromise = this.prisma.report.count({
      where: recentScopedObservationsWhere,
    });

    // notes
    const totalUserNotesPromise = this.prisma.note.count({
      where: { authorId: user.id },
    });
    const recentUserNotesPromise = this.prisma.note.count({
      where: recentUserObservationsWhere,
    });
    const recentScopedNotesPromise = this.prisma.note.count({
      where: recentScopedObservationsWhere,
    });

    // matches
    const totalUserMatchesPromise = this.prisma.match.count({
      where: {
        OR: [
          { notes: { some: { authorId: user.id } } },
          { reports: { some: { authorId: user.id } } },
        ],
      },
    });

    const recentUserMatchesPromise = this.prisma.match.count({
      where: {
        OR: [
          {
            notes: { some: recentUserObservationsWhere },
          },
          {
            reports: { some: recentUserObservationsWhere },
          },
        ],
      },
    });
    const recentScopedMatchesPromise = this.prisma.match.count({
      where: {
        OR: [
          { notes: { some: recentScopedObservationsWhere } },
          { reports: { some: recentScopedObservationsWhere } },
        ],
      },
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
    data.reports = totalUserReports;
    data.reportsRatio = calculatePercentage(
      recentUserReports,
      recentScopedReports,
    );

    data.notes = totalUserNotes;
    data.notesRatio = calculatePercentage(recentUserNotes, recentScopedNotes);

    data.observedMatches = totalUserMatches;
    data.observedMatchesRatio = calculatePercentage(
      recentUserMatches,
      recentScopedMatches,
    );

    return data;
  }

  // PlayMaker-Scout
  private async getPMData(user: CurrentUserDto) {
    const [data, sharedAclOrganizations] = await Promise.all([
      this.getScoutData(user),
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
      return { name: org.name, sharedInfo: observedMatchesIds.size };
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
    const scoutsPromise = this.prisma.user.count({
      where: {
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
      },
    });

    const playersPromise = this.prisma.player.count({
      where: {
        AND: [
          { OR: [{ notes: { some: {} } }, { reports: { some: {} } }] },
          playersSubscribed,
        ],
      },
    });

    const matchesPromise = this.prisma.match.count({
      where: {
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

    const [scouts, players, matches, topNotes, topReports] = await Promise.all([
      scoutsPromise,
      playersPromise,
      matchesPromise,
      topNotesPromise,
      topReportsPromise,
    ]);

    // include data
    data.scouts = scouts;
    data.observerdPlayers = players;
    data.observedMatches = matches;

    data.topNotes = topNotes;
    data.topReports = topReports;

    return data;
  }

  async getData(user: CurrentUserDto) {
    switch (user.role) {
      case 'ADMIN':
      case 'PLAYMAKER_SCOUT_MANAGER':
        return this.getScoutData(user);
      case 'PLAYMAKER_SCOUT':
        return this.getPMData(user);
      case 'SCOUT':
        if (user.organizationId) return this.getScoutOrganizationData(user);
        return this.getScoutData(user);
    }
  }
}
