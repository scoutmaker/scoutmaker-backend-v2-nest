import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isAfter, isBefore } from 'date-fns';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';

import { PrismaService } from '../../../modules/prisma/prisma.service';
import { playmakerRoles, privilegedRoles } from '../../../utils/constants';
import { OrganizationSubscriptionsService } from '../../organization-subscriptions/organization-subscriptions.service';
import { UserSubscriptionsService } from '../../user-subscriptions/user-subscriptions.service';

@Injectable()
export class ReadGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userSubscriptionsService: UserSubscriptionsService,
    private readonly organizationSubscriptionsService: OrganizationSubscriptionsService,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { user } = request;

    // If user is an admin, they can read all matches data
    if (user.role === 'ADMIN') return true;

    const observationsWhere: Prisma.NoteWhereInput | Prisma.ReportWhereInput = {
      OR: [
        { userAccessControlList: { some: { userId: user.id } } },
        {
          organizationAccessControlList: {
            some: { organizationId: user.organizationId },
          },
        },
      ],
    };

    // If user is not an admin, we have to fetch the match to determine if they can read it
    const match = await this.prisma.match.findUnique({
      where: { id: request.params.id },
      include: {
        author: true,
        homeTeam: true,
        awayTeam: true,
        notes: {
          where: observationsWhere,
        },
        reports: {
          where: observationsWhere,
        },
      },
    });

    // If user is a playmaker-scout or scout-manager, they can read all matches created by all other users except for SCOUT
    if (
      playmakerRoles.includes(user.role) &&
      privilegedRoles.includes(match.author.role)
    ) {
      return true;
    }

    // Users can read their own matches
    if (user.id === match.author.id) return true;

    // User or organization that he's in has ACE for note|report
    if (match.notes.length || match.reports.length) return true;

    // Then have to fetch the user's subscriptions to determine if they can read the match
    const [individualSubscriptions, organizationSubscriptions] =
      await Promise.all([
        this.userSubscriptionsService.getFormattedForSingleUser(user.id),
        this.organizationSubscriptionsService.getFormattedForSingleOrganization(
          user.organizationId,
        ),
      ]);
    const subscriptions = [
      ...individualSubscriptions,
      ...(organizationSubscriptions || []),
    ];

    const subscriptionAccess = subscriptions.some(
      (subscription) =>
        isAfter(new Date(match.date), new Date(subscription.startDate)) &&
        isBefore(new Date(match.date), new Date(subscription.endDate)) &&
        (subscription.competitions.includes(match.competitionId) ||
          subscription.competitionGroups.includes(match.groupId)),
    );
    if (subscriptionAccess) return true;

    const lang = request.acceptsLanguages()[0];

    const message = this.i18n.translate('match.GET_ONE_ACCESS_ERROR', {
      lang,
      args: { name: `${match.homeTeam.name} vs ${match.awayTeam.name}` },
    });

    throw new UnauthorizedException(message);
  }
}
