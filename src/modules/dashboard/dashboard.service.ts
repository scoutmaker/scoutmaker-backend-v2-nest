import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { FormattedSubscription } from '../../types/formatted-subscription';
import { OrganizationSubscriptionsService } from '../organization-subscriptions/organization-subscriptions.service';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserDto } from '../users/dto/current-user.dto';
import { DashboardDataDto } from './dto/dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationSubscriptionsService: OrganizationSubscriptionsService,
  ) {}

  private getPrecentage(x, total) {
    return +((x / total) * 100).toFixed();
  }

  // PM-ScoutManager | ADMIN
  private async getPriviledgedData(user: CurrentUserDto) {
    const data: DashboardDataDto = {};

    const today = new Date();
    const monthAgoDate = new Date(
      new Date().setDate(today.getDate() - 30),
    ).toISOString();

    const lastObservationsWhere:
      | Prisma.NoteWhereInput
      | Prisma.ReportWhereInput
      | Prisma.MatchWhereInput = {
      createdAt: { gte: monthAgoDate },
      author: {
        role: {
          in: ['PLAYMAKER_SCOUT', 'ADMIN', 'PLAYMAKER_SCOUT_MANAGER'],
        },
      },
    };

    // reports
    const userReportsPromise = this.prisma.report.count({
      where: { authorId: user.id },
    });
    const lastUserReportsPromise = this.prisma.report.count({
      where: { authorId: user.id, createdAt: { gte: monthAgoDate } },
    });
    const lastReportsPromise = this.prisma.report.count({
      where: lastObservationsWhere,
    });

    // notes
    const userNotesPromise = this.prisma.note.count({
      where: { authorId: user.id },
    });
    const lastUserNotesPromise = this.prisma.note.count({
      where: { authorId: user.id, createdAt: { gte: monthAgoDate } },
    });
    const lastNotesPromise = this.prisma.note.count({
      where: lastObservationsWhere,
    });

    // matches
    const observedMatchesPromise = this.prisma.match.count({
      where: {
        OR: [
          { notes: { some: { authorId: user.id } } },
          { reports: { some: { authorId: user.id } } },
        ],
      },
    });
    const lastObservedMatchesPromise = this.prisma.match.count({
      where: {
        createdAt: { gte: monthAgoDate },
        OR: [
          { notes: { some: { authorId: user.id } } },
          { reports: { some: { authorId: user.id } } },
        ],
      },
    });
    const lastAddedMatchesPromise = this.prisma.match.count({
      where: lastObservationsWhere,
    });

    const [
      userReports,
      userNotes,
      observedMatches,
      lastObservedMatches,
      lastAddedMatches,
      lastReports,
      lastNotes,
      lastUserReports,
      lastUserNotes,
    ] = await Promise.all([
      userReportsPromise,
      userNotesPromise,
      observedMatchesPromise,
      lastObservedMatchesPromise,
      lastAddedMatchesPromise,
      lastReportsPromise,
      lastNotesPromise,
      lastUserReportsPromise,
      lastUserNotesPromise,
    ]);

    // include data
    data.reports = userReports;
    data.reportsRatio = this.getPrecentage(lastUserReports, lastReports);

    data.notes = userNotes;
    data.notesRatio = this.getPrecentage(lastUserNotes, lastNotes);

    data.observedMatches = observedMatches;
    data.observedMatchesRatio = this.getPrecentage(
      lastObservedMatches,
      lastAddedMatches,
    );

    return data;
  }

  // PlayMaker-Scout
  private async getPMData(user: CurrentUserDto) {
    const [data, organizations] = await Promise.all([
      this.getPriviledgedData(user),
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
      }),
    ]);

    const organizationIds = organizations.map((o) => o.id);
    const observationsWhere: Prisma.NoteWhereInput | Prisma.ReportWhereInput = {
      organizationAccessControlList: {
        some: { organizationId: { in: organizationIds } },
      },
    };

    const matches = await this.prisma.match.findMany({
      where: {
        OR: [
          { notes: { some: observationsWhere } },
          { reports: { some: observationsWhere } },
        ],
      },
      include: {
        notes: {
          where: observationsWhere,
          include: { organizationAccessControlList: true },
        },
        reports: {
          where: observationsWhere,
          include: { organizationAccessControlList: true },
        },
      },
    });

    data.organizations = organizations.map((o) => {
      const sharedMatches = matches.filter(
        (m) =>
          m.notes.some((n) =>
            n.organizationAccessControlList.some(
              (acl) => acl.organizationId === o.id,
            ),
          ) ||
          m.reports.some((r) =>
            r.organizationAccessControlList.some(
              (acl) => acl.organizationId === o.id,
            ),
          ),
      );

      return { name: o.name, sharedInfo: sharedMatches.length };
    });

    return data;
  }

  private transformObservationSubscriptions(
    subscriptions: FormattedSubscription[],
  ): Prisma.NoteWhereInput | Prisma.ReportWhereInput {
    return {
      OR: subscriptions.map(
        ({ competitions, startDate, competitionGroups, endDate }) => ({
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          meta: {
            OR: [
              { competitionId: { in: competitions } },
              { competitionGroupId: { in: competitionGroups } },
            ],
          },
        }),
      ),
    };
  }

  private transformPlayerSubscriptions(
    subscriptions: FormattedSubscription[],
  ): Prisma.PlayerWhereInput {
    return {
      OR: subscriptions.map(
        ({ competitionGroups, competitions, endDate, startDate }) => ({
          teams: {
            some: {
              startDate: { lte: endDate },
              endDate: { gte: startDate },
              team: {
                competitions: {
                  some: {
                    OR: [
                      { competitionId: { in: competitions } },
                      { groupId: { in: competitionGroups } },
                    ],
                    season: {
                      startDate: { lte: endDate },
                      endDate: { gte: startDate },
                    },
                  },
                },
              },
            },
          },
        }),
      ),
    };
  }

  private transformMatchSubscriptions(
    subscriptions: FormattedSubscription[],
  ): Prisma.MatchWhereInput {
    return {
      OR: subscriptions.map(
        ({ competitionGroups, competitions, endDate, startDate }) => ({
          OR: [
            { competitionId: { in: competitions } },
            { groupId: { in: competitionGroups } },
          ],
          date: { gte: startDate, lte: endDate },
          season: {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        }),
      ),
    };
  }

  private async getScoutOrganizationData(user: CurrentUserDto) {
    const data: DashboardDataDto = {};
    const organizationSubscriptions =
      await this.organizationSubscriptionsService.getFormattedForSingleOrganization(
        user.organizationId,
      );

    const observationsSubscribed = this.transformObservationSubscriptions(
      organizationSubscriptions,
    );
    const playersSubscribed = this.transformPlayerSubscriptions(
      organizationSubscriptions,
    );
    const matchesSubscribed = this.transformMatchSubscriptions(
      organizationSubscriptions,
    );

    const scouts = await this.prisma.user.count({
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

    const players = await this.prisma.player.count({
      where: {
        AND: [
          { OR: [{ notes: { some: {} } }, { reports: { some: {} } }] },
          playersSubscribed,
        ],
      },
    });

    const matches = await this.prisma.match.count({
      where: matchesSubscribed,
    });

    const topNotes = await this.prisma.note.findMany({
      where: { AND: [{ rating: { in: [3, 4] } }, observationsSubscribed] },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        player: true,
        match: {
          include: { homeTeam: true, awayTeam: true, competition: true },
        },
      },
    });

    const topReports = await this.prisma.report.findMany({
      where: { AND: [{ finalRating: { in: [3, 4] } }, observationsSubscribed] },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        player: true,
        match: {
          include: { homeTeam: true, awayTeam: true, competition: true },
        },
      },
    });

    // include data
    data.scouts = scouts;
    data.observerdPlayers = players;
    data.observedMatches = matches;

    // what to do, in other modules types are not fully the same - if you see this I forgot to ask
    data.topNotes = topNotes as any;
    data.topReports = topReports as any;

    return data;
  }

  async getData(user: CurrentUserDto) {
    switch (user.role) {
      case 'ADMIN':
      case 'PLAYMAKER_SCOUT_MANAGER':
        return this.getPriviledgedData(user);
      case 'PLAYMAKER_SCOUT':
        return this.getPMData(user);
      case 'SCOUT':
        if (user.organizationId) return this.getScoutOrganizationData(user);
        return null;
    }
  }
}
