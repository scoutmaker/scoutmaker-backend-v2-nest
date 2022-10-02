import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OrganizationReportAccessControlEntry } from '@prisma/client';
import { isWithinInterval } from 'date-fns';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';

import { privilegedRoles } from '../../../utils/constants';
import { OrganizationReportAclService } from '../../organization-report-acl/organization-report-acl.service';
import { OrganizationSubscriptionsService } from '../../organization-subscriptions/organization-subscriptions.service';
import { UserReportAclService } from '../../user-report-acl/user-report-acl.service';
import { UserSubscriptionsService } from '../../user-subscriptions/user-subscriptions.service';
import { ReportsService } from '../reports.service';

@Injectable()
export class ReadGuard implements CanActivate {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly userSubscriptionsService: UserSubscriptionsService,
    private readonly organizationSubscriptionsService: OrganizationSubscriptionsService,
    private readonly userAclService: UserReportAclService,
    private readonly organizationAclService: OrganizationReportAclService,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const { user } = request;

    // If user is an admin, they can read all reports
    if (user.role === 'ADMIN') {
      return true;
    }

    // If user is not an admin, we have to fetch the report to determine if they can read it
    const report = await this.reportsService.findOne(request.params.id);

    // If user is a scout-manager, they can read all reports created by all other users except for SCOUT
    if (
      user.role === 'PLAYMAKER_SCOUT_MANAGER' &&
      privilegedRoles.includes(report.author.role)
    ) {
      return true;
    }

    // Users can read their own reports
    if (user.id === report.author.id) {
      return true;
    }

    // Users can read reports if they have ACE for this note
    const userAce = await this.userAclService.findOneByUserAndReportId(
      user.id,
      report.id,
    );

    if (userAce) {
      return true;
    }

    // User can read reports if their organization has ACE for this note
    let organizationAce: OrganizationReportAccessControlEntry = null;

    if (user.organizationId) {
      organizationAce =
        await this.organizationAclService.findOneByOrganizationAndReportId(
          user.organizationId,
          report.id,
        );
    }

    if (organizationAce) {
      return true;
    }

    // Then have to fetch the user's subscriptions to determine if they can read the note
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
        (subscription.competitions.includes(report?.meta?.competitionId) ||
          subscription.competitionGroups.includes(
            report?.meta?.competitionGroupId,
          )) &&
        isWithinInterval(new Date(report.createdAt), {
          start: new Date(subscription.startDate),
          end: new Date(subscription.endDate),
        }),
    );

    if (subscriptionAccess) {
      return true;
    }

    const lang = request.acceptsLanguages()[0];

    const message = this.i18n.translate('reports.GET_ONE_ACCESS_ERROR', {
      lang,
      args: { docNumber: report.docNumber },
    });

    throw new UnauthorizedException(message);
  }
}
