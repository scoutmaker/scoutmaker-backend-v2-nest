import { Test, TestingModule } from '@nestjs/testing';

import { PlayerGradesService } from './player-grades.service';

describe('PlayerGradesService', () => {
  let service: PlayerGradesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerGradesService],
    }).compile();

    service = module.get<PlayerGradesService>(PlayerGradesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
