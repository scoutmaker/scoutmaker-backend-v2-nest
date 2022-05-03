import { Test, TestingModule } from '@nestjs/testing';
import { LikeTeamsController } from './like-teams.controller';
import { LikeTeamsService } from './like-teams.service';

describe('LikeTeamsController', () => {
  let controller: LikeTeamsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikeTeamsController],
      providers: [LikeTeamsService],
    }).compile();

    controller = module.get<LikeTeamsController>(LikeTeamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
