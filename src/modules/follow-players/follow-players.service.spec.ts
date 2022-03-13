import { Test, TestingModule } from '@nestjs/testing';
import { FollowPlayersService } from './follow-players.service';

describe('FollowPlayersService', () => {
  let service: FollowPlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FollowPlayersService],
    }).compile();

    service = module.get<FollowPlayersService>(FollowPlayersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
