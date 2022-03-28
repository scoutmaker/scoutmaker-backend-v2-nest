import { Test, TestingModule } from '@nestjs/testing';

import { UserInsiderNoteAclController } from './user-insider-note-acl.controller';
import { UserInsiderNoteAclService } from './user-insider-note-acl.service';

describe('UserNoteAclController', () => {
  let controller: UserInsiderNoteAclController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserInsiderNoteAclController],
      providers: [UserInsiderNoteAclService],
    }).compile();

    controller = module.get<UserInsiderNoteAclController>(
      UserInsiderNoteAclController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
