import { Test, TestingModule } from '@nestjs/testing';

import { OrganizationPlayerAclService } from './organization-player-acl.service';

describe('OrganizationPlayerAclService', () => {
  let service: OrganizationPlayerAclService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationPlayerAclService],
    }).compile();

    service = module.get<OrganizationPlayerAclService>(
      OrganizationPlayerAclService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
