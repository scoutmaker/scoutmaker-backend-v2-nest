import { Test, TestingModule } from '@nestjs/testing';

import { OrganizationSubscriptionsController } from './organization-subscriptions.controller';
import { OrganizationSubscriptionsService } from './organization-subscriptions.service';

describe('OrganizationSubscriptionsController', () => {
  let controller: OrganizationSubscriptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationSubscriptionsController],
      providers: [OrganizationSubscriptionsService],
    }).compile();

    controller = module.get<OrganizationSubscriptionsController>(
      OrganizationSubscriptionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
