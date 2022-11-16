import { Module } from '@nestjs/common';

import { OrganizationSubscriptionsService } from '../organization-subscriptions/organization-subscriptions.service';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, OrganizationSubscriptionsService],
})
export class DashboardModule {}
