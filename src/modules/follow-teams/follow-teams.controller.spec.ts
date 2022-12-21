import { Test, TestingModule } from '@nestjs/testing';

import { FollowTeamsController } from './follow-teams.controller';
import { FollowTeamsService } from './follow-teams.service';

describe('FollowTeamsController', () => {
  let controller: FollowTeamsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowTeamsController],
      providers: [FollowTeamsService],
    }).compile();

    controller = module.get<FollowTeamsController>(FollowTeamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
