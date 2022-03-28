import { Test, TestingModule } from '@nestjs/testing';

import { OrganizationNoteAclController } from './organization-report-acl.controller';
import { OrganizationNoteAclService } from './organization-report-acl.service';

describe('OrganizationNoteAclController', () => {
  let controller: OrganizationNoteAclController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationNoteAclController],
      providers: [OrganizationNoteAclService],
    }).compile();

    controller = module.get<OrganizationNoteAclController>(
      OrganizationNoteAclController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
