import { Test, TestingModule } from '@nestjs/testing';

import { OrganizationNoteAclService } from './organization-report-acl.service';

describe('OrganizationNoteAclService', () => {
  let service: OrganizationNoteAclService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationNoteAclService],
    }).compile();

    service = module.get<OrganizationNoteAclService>(
      OrganizationNoteAclService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
