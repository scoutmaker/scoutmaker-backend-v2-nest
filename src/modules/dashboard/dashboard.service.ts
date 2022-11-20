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

    const lastObservationsWhere:
      | Prisma.NoteWhereInput
      | Prisma.ReportWhereInput = {
      createdAt: { gte: monthAgoDate },
      author: {
        role: {
          in: rolesScope,
        },
      },
    };

    const lastUserObserevationsWhere:
      | Prisma.NoteWhereInput
      | Prisma.ReportWhereInput = {
      createdAt: { gte: monthAgoDate },
      authorId: user.id,
    };

    // reports
    const userReportsPromise = this.prisma.report.count({
      where: { authorId: user.id },
    });
    const lastUserReportsPromise = this.prisma.report.count({
      where: lastUserObserevationsWhere,
    });
    const lastReportsPromise = this.prisma.report.count({
      where: lastObservationsWhere,
    });

    // notes
    const userNotesPromise = this.prisma.note.count({
      where: { authorId: user.id },
    });
    const lastUserNotesPromise = this.prisma.note.count({
      where: lastUserObserevationsWhere,
    });
    const lastNotesPromise = this.prisma.note.count({
      where: lastObservationsWhere,
    });

    // matches
    const userMatchesPromise = this.prisma.match.count({
      where: {
        OR: [
          { notes: { some: { authorId: user.id } } },
          { reports: { some: { authorId: user.id } } },
        ],
      },
    });

    const lastUserMatchesPromise = this.prisma.match.count({
      where: {
        OR: [
          {
            notes: { some: lastUserObserevationsWhere },
          },
          {
            reports: { some: lastUserObserevationsWhere },
          },
        ],
      },
    });
    const lastMatchesPromise = this.prisma.match.count({
      where: {
        OR: [
          { notes: { some: lastObservationsWhere } },
          { reports: { some: lastObservationsWhere } },
        ],
      },
    });

    const [
      userReports,
      userNotes,
      userMatches,
      lastUserMatches,
      lastMatches,
      lastReports,
      lastNotes,
      lastUserReports,
      lastUserNotes,
    ] = await Promise.all([
      userReportsPromise,
      userNotesPromise,
      userMatchesPromise,
      lastUserMatchesPromise,
      lastMatchesPromise,
      lastReportsPromise,
      lastNotesPromise,
      lastUserReportsPromise,
      lastUserNotesPromise,
    ]);

    // include data
    data.reports = userReports;
    data.reportsRatio = calculatePercentage(lastUserReports, lastReports);

    data.notes = userNotes;
    data.notesRatio = calculatePercentage(lastUserNotes, lastNotes);

    data.observedMatches = userMatches;
    data.observedMatchesRatio = calculatePercentage(
      lastUserMatches,
      lastMatches,
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
