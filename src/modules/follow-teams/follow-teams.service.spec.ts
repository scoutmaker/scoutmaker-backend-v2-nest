import { Test, TestingModule } from '@nestjs/testing';

import { FollowTeamsService } from './follow-teams.service';

describe('FollowTeamsService', () => {
  let service: FollowTeamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FollowTeamsService],
    }).compile();

    service = module.get<FollowTeamsService>(FollowTeamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
