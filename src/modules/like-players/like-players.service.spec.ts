import { Test, TestingModule } from '@nestjs/testing';

import { LikePlayersService } from './like-players.service';

describe('LikePlayersService', () => {
  let service: LikePlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikePlayersService],
    }).compile();

    service = module.get<LikePlayersService>(LikePlayersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
