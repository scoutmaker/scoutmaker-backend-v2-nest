import { Test, TestingModule } from '@nestjs/testing';

import { OrganizationInsiderNoteAclController } from './organization-insider-note-acl.controller';
import { OrganizationInsiderNoteAclService } from './organization-insider-note-acl.service';

describe('OrganizationNoteAclController', () => {
  let controller: OrganizationInsiderNoteAclController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationInsiderNoteAclController],
      providers: [OrganizationInsiderNoteAclService],
    }).compile();

    controller = module.get<OrganizationInsiderNoteAclController>(
      OrganizationInsiderNoteAclController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
