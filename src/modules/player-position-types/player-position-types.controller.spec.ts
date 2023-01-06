import { Test, TestingModule } from '@nestjs/testing';

import { PlayerPositionTypesController } from './player-position-types.controller';
import { PlayerPositionTypesService } from './player-position-types.service';

describe('PlayerPositionTypesController', () => {
  let controller: PlayerPositionTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerPositionTypesController],
      providers: [PlayerPositionTypesService],
    }).compile();

    controller = module.get<PlayerPositionTypesController>(
      PlayerPositionTypesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
