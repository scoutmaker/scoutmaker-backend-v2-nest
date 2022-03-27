import { Test, TestingModule } from '@nestjs/testing';
import { UserPlayerAclController } from './user-player-acl.controller';
import { UserPlayerAclService } from './user-player-acl.service';

describe('UserPlayerAclController', () => {
  let controller: UserPlayerAclController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPlayerAclController],
      providers: [UserPlayerAclService],
    }).compile();

    controller = module.get<UserPlayerAclController>(UserPlayerAclController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
