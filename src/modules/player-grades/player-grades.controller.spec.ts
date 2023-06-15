import { Test, TestingModule } from '@nestjs/testing';

import { PlayerGradesController } from './player-grades.controller';
import { PlayerGradesService } from './player-grades.service';

describe('PlayerGradesController', () => {
  let controller: PlayerGradesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerGradesController],
      providers: [PlayerGradesService],
    }).compile();

    controller = module.get<PlayerGradesController>(PlayerGradesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
