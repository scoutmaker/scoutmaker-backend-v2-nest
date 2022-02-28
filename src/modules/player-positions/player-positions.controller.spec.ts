import { Test, TestingModule } from '@nestjs/testing';
import { PlayerPositionsController } from './player-positions.controller';
import { PlayerPositionsService } from './player-positions.service';

describe('PlayerPositionsController', () => {
  let controller: PlayerPositionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerPositionsController],
      providers: [PlayerPositionsService],
    }).compile();

    controller = module.get<PlayerPositionsController>(PlayerPositionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
