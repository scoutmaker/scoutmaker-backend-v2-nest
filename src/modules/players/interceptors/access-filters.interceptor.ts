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
  ): Prisma.PlayerWhereInput {
    const subscriptions = [
      ...individualSubscriptions,
      ...(organizationSubscriptions || []),
    ];

    return {
      OR: subscriptions.map(
        ({ startDate, endDate, competitions, competitionGroups }) => ({
          OR: [
            {
              teams: {
                some: {
                  startDate: { lte: endDate },
                  endDate: { gte: startDate },
                  team: {
                    competitions: {
                      some: {
                        competition: { id: { in: competitions } },
                        season: {
                          startDate: { lte: endDate },
                          endDate: { gte: startDate },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              teams: {
                some: {
                  startDate: { lte: endDate },
                  endDate: { gte: startDate },
                  team: {
                    competitions: {
                      some: {
                        group: { id: { in: competitionGroups } },
                        season: {
                          startDate: { lte: endDate },
                          endDate: { gte: startDate },
                        },
                      },
                    },
                  },
                },
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

    const organizationPlayerAccess: Prisma.PlayerWhereInput =
      user.organizationId
        ? {
            organizationAccessControlList: {
              some: { organizationId: user.organizationId },
            },
          }
        : {};

    const organizationNoteAccess: Prisma.PlayerWhereInput = user.organizationId
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

    const organizationInsiderNoteAccess: Prisma.PlayerWhereInput =
      user.organizationId
        ? {
            insiderNotes: {
              some: {
                organizationAccessControlList: {
                  some: { organizationId: user.organizationId },
                },
              },
            },
          }
        : {};

    const organizationReportAccess: Prisma.PlayerWhereInput =
      user.organizationId
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

    const accessFilters: Prisma.PlayerWhereInput = {
      OR: [
        transformedSubscriptions,
        {
          authorId: request.user.id,
        },
        {
          userAccessControlList: {
            some: { userId: request.user.id },
          },
        },
        {
          notes: {
            some: {
              userAccessControlList: { some: { userId: request.user.id } },
            },
          },
        },
        {
          insiderNotes: {
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
          ...organizationPlayerAccess,
        },
        {
          ...organizationInsiderNoteAccess,
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

    request.accessFilters = accessFilters;

    return next.handle();
  }
}
