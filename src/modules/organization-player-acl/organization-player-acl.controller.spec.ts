import { Test, TestingModule } from '@nestjs/testing';

import { OrganizationPlayerAclController } from './organization-player-acl.controller';
import { OrganizationPlayerAclService } from './organization-player-acl.service';

describe('OrganizationPlayerAclController', () => {
  let controller: OrganizationPlayerAclController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationPlayerAclController],
      providers: [OrganizationPlayerAclService],
    }).compile();

    controller = module.get<OrganizationPlayerAclController>(
      OrganizationPlayerAclController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
