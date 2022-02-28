import { Test, TestingModule } from '@nestjs/testing';
import { PlayerPositionsService } from './player-positions.service';

describe('PlayerPositionsService', () => {
  let service: PlayerPositionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerPositionsService],
    }).compile();

    service = module.get<PlayerPositionsService>(PlayerPositionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
