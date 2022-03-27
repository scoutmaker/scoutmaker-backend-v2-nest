import { Test, TestingModule } from '@nestjs/testing';
import { UserPlayerAclService } from './user-player-acl.service';

describe('UserPlayerAclService', () => {
  let service: UserPlayerAclService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPlayerAclService],
    }).compile();

    service = module.get<UserPlayerAclService>(UserPlayerAclService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
