import { Test, TestingModule } from '@nestjs/testing';

import { OrganizationInsiderNoteAclService } from './organization-insider-note-acl.service';

describe('OrganizationNoteAclService', () => {
  let service: OrganizationInsiderNoteAclService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationInsiderNoteAclService],
    }).compile();

    service = module.get<OrganizationInsiderNoteAclService>(
      OrganizationInsiderNoteAclService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
