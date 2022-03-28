import { Test, TestingModule } from '@nestjs/testing';

import { UserInsiderNoteAclService } from './user-insider-note-acl.service';

describe('UserNoteAclService', () => {
  let service: UserInsiderNoteAclService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserInsiderNoteAclService],
    }).compile();

    service = module.get<UserInsiderNoteAclService>(UserInsiderNoteAclService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
