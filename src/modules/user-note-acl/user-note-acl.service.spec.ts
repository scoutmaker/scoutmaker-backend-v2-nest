import { Test, TestingModule } from '@nestjs/testing';

import { UserNoteAclService } from './user-note-acl.service';

describe('UserNoteAclService', () => {
  let service: UserNoteAclService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserNoteAclService],
    }).compile();

    service = module.get<UserNoteAclService>(UserNoteAclService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
