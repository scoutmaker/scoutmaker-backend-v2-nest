import { Test, TestingModule } from '@nestjs/testing';
import { PlayerStatsService } from './player-stats.service';

describe('PlayerStatsService', () => {
  let service: PlayerStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerStatsService],
    }).compile();

    service = module.get<PlayerStatsService>(PlayerStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
