import { Module } from '@nestjs/common';
import { OrganizationSubscriptionsService } from './organization-subscriptions.service';
import { OrganizationSubscriptionsController } from './organization-subscriptions.controller';

@Module({
  controllers: [OrganizationSubscriptionsController],
  providers: [OrganizationSubscriptionsService]
})
export class OrganizationSubscriptionsModule {}
