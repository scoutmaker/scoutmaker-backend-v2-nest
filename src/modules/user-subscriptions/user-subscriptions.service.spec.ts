import { Test, TestingModule } from '@nestjs/testing';

import { UserSubscriptionsService } from './user-subscriptions.service';

describe('UserSubscriptionsService', () => {
  let service: UserSubscriptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSubscriptionsService],
    }).compile();

    service = module.get<UserSubscriptionsService>(UserSubscriptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
