import { Test, TestingModule } from '@nestjs/testing';

import { PlayerPositionTypesService } from './player-position-types.service';

describe('PlayerPositionTypesService', () => {
  let service: PlayerPositionTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerPositionTypesService],
    }).compile();

    service = module.get<PlayerPositionTypesService>(
      PlayerPositionTypesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
