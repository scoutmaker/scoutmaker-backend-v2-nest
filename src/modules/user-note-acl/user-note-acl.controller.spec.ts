import { Test, TestingModule } from '@nestjs/testing';

import { UserNoteAclController } from './user-note-acl.controller';
import { UserNoteAclService } from './user-note-acl.service';

describe('UserNoteAclController', () => {
  let controller: UserNoteAclController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserNoteAclController],
      providers: [UserNoteAclService],
    }).compile();

    controller = module.get<UserNoteAclController>(UserNoteAclController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
