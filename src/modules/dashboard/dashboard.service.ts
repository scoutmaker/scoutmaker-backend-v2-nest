import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { subMonths } from 'date-fns';

import { calculatePercentage } from '../../utils/helpers';
import { MatchesService } from '../matches/matches.service';
import { NotesService } from '../notes/notes.service';
import { OrganizationSubscriptionsService } from '../organization-subscriptions/organization-subscriptions.service';
import { OrganizationsService } from '../organizations/organizations.service';
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
    private readonly organizationsService: OrganizationsService,
  ) {}

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

    return {
      user,
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

  // get organizations that have access to your observations
  // to implement - check subscriptions
  private async getOrganizationsForPMScout(
    user: CurrentUserDto,
  ): Promise<DashboardDto['organizations']> {
    const sharedAclOrganizations = await this.prisma.organization.findMany({
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
    });

    return sharedAclOrganizations.map((org) => {
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
  }

  // PlayMaker-Scout
  private async getPlaymakerScoutData(
    user: CurrentUserDto,
  ): Promise<DashboardDto> {
    const [data, organizations] = await Promise.all([
      this.getCommonData(user),
      this.getOrganizationsForPMScout(user),
    ]);

    return { ...data, organizations };
  }

  private async getScoutOrganizationData(
    user: CurrentUserDto,
  ): Promise<DashboardDto> {
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
      AND: [
        { OR: [{ notes: { some: {} } }, { reports: { some: {} } }] },
        playersSubscribed,
      ],
    });

    const matchesCountPromise = this.matchesService.getCount({
      AND: [
        { OR: [{ notes: { some: {} } }, { reports: { some: {} } }] },
        matchesSubscribed,
      ],
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

    return {
      user,
      scoutsCount,
      observerdPlayersCount: playersCount,
      observedMatchesCount: matchesCount,
      topNotes: topNotes,
      topReports: topReports,
    };
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
