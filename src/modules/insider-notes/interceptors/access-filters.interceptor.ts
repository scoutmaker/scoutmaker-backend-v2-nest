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
  ): Prisma.InsiderNoteWhereInput {
    const subscriptions = [
      ...individualSubscriptions,
      ...(organizationSubscriptions || []),
    ];

    return {
      OR: subscriptions.map(
        ({ startDate, endDate, competitions, competitionGroups }) => ({
          OR: [
            {
              meta: { competitionId: { in: competitions } },
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
            {
              meta: {
                competitionGroupId: { in: competitionGroups },
              },
              createdAt: {
                gte: startDate,
                lte: endDate,
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

    const accessFilters: Prisma.InsiderNoteWhereInput = {
      OR: [
        transformedSubscriptions,
        {
          authorId: request.user.id,
        },
        {
          userAccessControlList: { some: { userId: request.user.id } },
        },
        {
          organizationAccessControlList: {
            some: {
              organizationId: user.organizationId,
            },
          },
        },
      ],
    };

    console.log({ accessFilters: JSON.stringify(accessFilters, null, 2) });

    request.accessFilters = accessFilters;

    return next.handle();
  }
}
