import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { FormattedSubscription } from '../../../types/formatted-subscription';
import { OrganizationSubscriptionsService } from '../../organization-subscriptions/organization-subscriptions.service';
import { UserSubscriptionsService } from '../../user-subscriptions/user-subscriptions.service';

@Injectable()
export class AccessFiltersInterceptor implements NestInterceptor {
  constructor(
    private readonly userSubscriptionsService: UserSubscriptionsService,
    private readonly organizationSubscriptionsService: OrganizationSubscriptionsService,
  ) {}

  private transformSubscriptions(
    individualSubscriptions: FormattedSubscription[],
    organizationSubscriptions?: FormattedSubscription[],
  ): Prisma.MatchWhereInput {
    const subscriptions = [
      ...individualSubscriptions,
      ...(organizationSubscriptions || []),
    ];

    return {
      OR: subscriptions.map(
        ({ startDate, endDate, competitions, competitionGroups }) => ({
          OR: [
            {
              competition: { id: { in: competitions } },
              date: { gte: startDate, lte: endDate },
              season: {
                startDate: { lte: endDate },
                endDate: { gte: startDate },
              },
            },
            {
              group: { id: { in: competitionGroups } },
              date: { gte: startDate, lte: endDate },
              season: {
                startDate: { lte: endDate },
                endDate: { gte: startDate },
              },
            },
          ],
        }),
      ),
    };
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();

    const { user } = request;

    if (user.role === 'ADMIN') {
      request.accessFilters = null;
      return next.handle();
    }

    const [individualSubscriptions, organizationSubscriptions] =
      await Promise.all([
        this.userSubscriptionsService.getFormattedForSingleUser(user.id),
        this.organizationSubscriptionsService.getFormattedForSingleOrganization(
          user.organizationId,
        ),
      ]);

    const transformedSubscriptions = this.transformSubscriptions(
      individualSubscriptions,
      organizationSubscriptions,
    );

    const playmakerExtraAccess: Prisma.PlayerWhereInput =
      user.role === 'PLAYMAKER_SCOUT_MANAGER'
        ? { author: { role: { not: 'SCOUT' } } }
        : {};

    const organizationNoteAccess: Prisma.MatchWhereInput = user.organizationId
      ? {
          notes: {
            some: {
              organizationAccessControlList: {
                some: { organizationId: user.organizationId },
              },
            },
          },
        }
      : {};

    const organizationReportAccess: Prisma.MatchWhereInput = user.organizationId
      ? {
          reports: {
            some: {
              organizationAccessControlList: {
                some: { organizationId: user.organizationId },
              },
            },
          },
        }
      : {};

    const accessFilters: Prisma.MatchWhereInput = {
      OR: [
        transformedSubscriptions,
        {
          authorId: request.user.id,
        },
        {
          notes: {
            some: {
              userAccessControlList: { some: { userId: request.user.id } },
            },
          },
        },
        {
          reports: {
            some: {
              userAccessControlList: { some: { userId: request.user.id } },
            },
          },
        },
        {
          ...organizationNoteAccess,
        },
        {
          ...organizationReportAccess,
        },
        { ...playmakerExtraAccess },
      ],
    };

    request['matchesAccessFilters'] = accessFilters;

    return next.handle();
  }
}
