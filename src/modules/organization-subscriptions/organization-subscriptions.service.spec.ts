import { Test, TestingModule } from '@nestjs/testing';

import { OrganizationSubscriptionsService } from './organization-subscriptions.service';

describe('OrganizationSubscriptionsService', () => {
  let service: OrganizationSubscriptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationSubscriptionsService],
    }).compile();

    service = module.get<OrganizationSubscriptionsService>(
      OrganizationSubscriptionsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
