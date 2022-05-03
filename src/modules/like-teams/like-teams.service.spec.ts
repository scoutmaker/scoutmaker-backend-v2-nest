import { Test, TestingModule } from '@nestjs/testing';
import { LikeTeamsService } from './like-teams.service';

describe('LikeTeamsService', () => {
  let service: LikeTeamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikeTeamsService],
    }).compile();

    service = module.get<LikeTeamsService>(LikeTeamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
