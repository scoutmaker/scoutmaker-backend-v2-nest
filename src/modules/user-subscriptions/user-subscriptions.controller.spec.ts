import { Test, TestingModule } from '@nestjs/testing';

import { UserSubscriptionsController } from './user-subscriptions.controller';
import { UserSubscriptionsService } from './user-subscriptions.service';

describe('UserSubscriptionsController', () => {
  let controller: UserSubscriptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSubscriptionsController],
      providers: [UserSubscriptionsService],
    }).compile();

    controller = module.get<UserSubscriptionsController>(
      UserSubscriptionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
