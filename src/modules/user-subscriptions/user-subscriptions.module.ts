import { Module } from '@nestjs/common';
import { UserSubscriptionsService } from './user-subscriptions.service';
import { UserSubscriptionsController } from './user-subscriptions.controller';

@Module({
  controllers: [UserSubscriptionsController],
  providers: [UserSubscriptionsService]
})
export class UserSubscriptionsModule {}
